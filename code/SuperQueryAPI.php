<?php

namespace UncleCheese\SuperQuery;

use \RequestHandler;
use \Permission;
use \JSONDataFormatter;
use \SS_HTTPResponse;
use \DataList;
use \Injector;
use \SS_HTTPRequest;
use \DataObject;
use \ArrayList;
use \Convert;
use \PaginatedList;
use \ArrayData;
use \SuperQuerySavedState;
use PHPSQLParser\PHPSQLParser;
use PHPSQLParser\PHPSQLCreator;

class SuperQueryAPI extends RequestHandler
{
	protected $parent;

	protected $expressionLanguage;

	protected $formats = [
		'csv',
		'json'
	];

	private static $url_handlers = [
		'POST savedquery' => 'handleSave',
		'GET savedquery' => 'handleSavedQueries',
		'DELETE savedquery/$ID' => 'handleDeleteQuery',
		'PUT savedquery/$ID' => 'handleUpdateQuery'
	];

	private static $allowed_actions = [
		'handleSave',
		'handleSavedQueries',
		'handleDeleteQuery',
		'handleUpdateQuery'
	];

	public function __construct(SuperQueryAdmin $parent)
	{
		$this->parent = $parent;
		$this->expressionLanguage = Injector::inst()->get('SuperQueryExpressionLanguage');

		parent::__construct();
	}
	
	public function init()
	{
		parent::init();
		
		if(!Permission::check('ADMIN')) {
			return $this->httpError(403);
		}
	}

	public function index(SS_HTTPRequest $r) {
		$query = $r->getVar('query');
		$isORM = preg_match('/^_\(/', $r->getVar('query'));

		return $isORM ? $this->respondORM($r) : $this->respondSQL($r);
	}

	protected function respondORM(SS_HTTPRequest $r) {
		try {
			$results = $this->expressionLanguage->evaluate(
				$r->getVar('query')
			);		
		} catch (\Exception $e) {
			return $this->httpError(500, $e->getMessage());
		}
		
		$format = $r->getVar('format');
		$formatter = JSONDataFormatter::create();
		$class = null;		

		// Single result, e.g. first()
		if($results instanceof DataObject) {			
			$class = $results->class;
			$results = ArrayList::create([$results]);

		}
		// list of results
		else if($results instanceof DataList) {
			$class = $results->dataClass();
			if($r->getVar('sortCol')) {				
				$dir = $r->getVar('sortDir') ?: 'ASC';
				$results = $results->sort($r->getVar('sortCol'), $dir);
			}

		}
		// Scalar value, e.g. max('SortOrder')
		else if ($results && !is_object($results)) {
			$val = $results;
			$results = ArrayList::create();
			$results->push(ArrayData::create(['Value' => $val]));
		}

		if($class) {
			if($format) {
				$formatter->setCustomFields(explode(',', $r->getVar('cols')));
			}
			else {
				$formatter->setCustomFields(array_merge(
					array_keys(DataObject::config()->fixed_fields),
					array_keys(Injector::inst()->get($class)->inheritedDatabaseFields())
				));
			}
		}
		else {
			$formatter->setCustomFields(['Value']);
			$formatter->relationDepth = 0;
		}

		if($format) {			
			return $this->export($results, $formatter, $format);
		}

		$results = PaginatedList::create($results, $r)
			->setPaginationGetVar('offset')
			->setPageLength(self::config()->results_per_page);
		
		$size = $results->getTotalItems();
		$hasMore = $results->NotLastPage();
		$totalPages = $results->TotalPages();
		$page = $results->CurrentPage();
		
		$items = [];
		foreach($results as $item) {
			$items[] = $formatter->convertDataObjectToJSONObject($item);
		}

		return (new SS_HTTPResponse(Convert::array2json([
				'dataClass' => $class,
				'totalSize' => $size,
				'items' => $items,
				'hasMore' => $hasMore,
				'page' => $page,
				'totalPages' => $totalPages
			]), 200))
			->addHeader('Content-type','application/json');
	}

	protected function respondSQL(SS_HTTPRequest $r) {
		try {
			$query = $r->getVar('query');
			$parser = new PHPSQLParser();
			$parsed = $parser->parse($query);			
		} catch (\Exception $e) {
			return $this->httpError(500, $e->getMessage());
		}
		
		$format = $r->getVar('format');
		$formatter = JSONDataFormatter::create();

		if(empty($parsed['SELECT']) || empty($parsed['FROM'])) {
			return $this->httpError(500, 'Raw SQL queries must be a SELECT from a table');
		}

		$class = $parsed['FROM'][0]['table'];
		
		if(empty($parsed['LIMIT'])) {
			$parsed['LIMIT'] = [
				'rowcount' => self::config()->results_per_page,
				'offset' => 0
			];
		}

		if($r->getVar('sortCol')) {				
			$dir = $r->getVar('sortDir') ?: 'ASC';
			$parsed['ORDER'] = [[
            	'base_expr' => $r->getVar('sortCol'),
            	'direction' => $dir
			]];
		}

		$creator = new PHPSQLCreator($parsed);
		$sql = $creator->created;
		try {
			$results = \DB::query($sql);
		} catch(\Exception $e) {
			return $this->httpError(500, $e->getMessage());
		}


		if($format) {			
			return $this->export($results, $formatter, $format);
		}

		return (new SS_HTTPResponse(Convert::array2json([
				'dataClass' => $class,
				'totalSize' => count($results),
				'items' => iterator_to_array($results),
				'hasMore' => false,
				'page' => 1,
				'totalPages' => 1
			]), 200))
			->addHeader('Content-type','application/json');
	}

    public function handleSave(SS_HTTPRequest $r)
    {
    	$title = $r->postVar('title');
    	$state = $r->postVar('state');

    	if(!$title) {
    		return $this->httpError(400, 'Please provide a title');
    	}

    	if(!$state) {
    		return $this->httpError(400, 'Invalid state');
    	}

    	if(SuperQuerySavedState::get()->filter('Title', $title)->exists()) {
    		return $this->httpError(400, 'A query with that title already exists');
    	}

    	$saved = SuperQuerySavedState::create([
    		'Title' => $title,
    		'State' => $state
    	]);

    	$saved->write();

    	return new SS_HTTPResponse('OK', 200);
    }	

    public function handleSavedQueries(SS_HTTPRequest $r)
    {
    	$records = [];
    	foreach(SuperQuerySavedState::get() as $q) {
    		$records[] = [
    			'id' => $q->ID,
    			'title' => $q->Title,
    			'state' => $q->State
    		];
    	}

		return (new SS_HTTPResponse(Convert::array2json($records), 200))
			->addHeader('Content-type','application/json');
    }

    public function handleDeleteQuery(SS_HTTPRequest $r)
    {
    	$id = $r->param('ID');
    	$query = SuperQuerySavedState::get()->byID($id);
    	if(!query) {
    		return $this->httpError(404, 'Query not found');
    	}

    	$query->delete();

    	return new SS_HTTPResponse('OK', 200);
    }

    public function handleUpdateQuery(SS_HTTPRequest $r)
    {
    	$id = $r->param('ID');
    	parse_str($r->getBody(), $vars);
    	if(empty($vars['state'])) {
    		return $this->httpError(404, 'Invalid state');
    	}

    	$query = SuperQuerySavedState::get()->byID($id);
    	if(!$query) {
    		return $this->httpError(404, 'Query not found');
    	}

    	$query->State = $vars['state'];
    	$query->write();
    	
    	return new SS_HTTPResponse('OK', 200);
    }

	protected function export($results, JSONDataFormatter $formatter, $format = null)
	{
		if(!in_array($format, $this->formats)) {
			return $this->httpError(400, 'Invalid format: ' . $format);
		}		

		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
		header('Content-Description: File Transfer');
		header("Content-type: text/{$format}");
		header("Content-Disposition: attachment; filename=export.{$format}");
		header("Expires: 0");
		header("Pragma: public");

		$fp = fopen('php://output', 'w');
    	// Setup file to be UTF8
    	fprintf($fp, chr(0xEF) . chr(0xBB) . chr(0xBF));

		if($format === 'json') {
			if($results instanceof SS_List) {
				$items = [];
				foreach($results as $item) {
					$items[] = $formatter->convertDataObjectToJSONObject($item);
				}
			} else {
				$items = iterator_to_array($results);
			}
			fwrite($fp, json_encode($items, JSON_PRETTY_PRINT));
		}

		else if($format === 'csv') {
			if($results instanceof SS_List) {
				fputcsv($fp, $formatter->getCustomFields());
	        	foreach($results as $r) {
	        		$fields = array_map(function ($fieldName) use ($r) {
	        			return $r->$fieldName;
	        		}, $formatter->getCustomFields());
		            fputcsv($fp, $fields);
		        }				
			} else {
				$arr = iterator_to_array($results);
				fputcsv($fp, array_keys($arr[0]));
				foreach($arr as $r) {
					fputcsv($fp, array_values($r));
				}
			}
        }
        fclose($fp);
	}
}
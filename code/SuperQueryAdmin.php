<?php

class SuperQueryAdmin extends LeftAndMain
{	
	private static $menu_title = 'Queries';

	private static $url_segment = 'superquery';

	private static $url_handlers = [
		'api' => 'handleAPI'
	];

	private static $allowed_actions = [
		'handleAPI' => 'ADMIN'
	];

	public function init()
	{
		parent::init();

		if(!Permission::check('ADMIN')) {
			return $this->httpError(403);
		}
	}

	public function EditForm($request = null)
	{		
		if($this->isWebpackDevServer()) {
			Requirements::block('htmlEditorConfig');
			Requirements::javascript('http://127.0.0.1:3000/production/js/main.js');
		}
		else {
			Requirements::javascript(SUPERQUERY_DIR.'/production/js/main.js');
			Requirements::css(SUPERQUERY_DIR.'/production/css/main.css');
		}

		$config = Convert::array2json([
			'baseURL' => $this->Link()
		]);

		return Form::create(
			$this,
			'EditForm',
			FieldList::create(
				LiteralField::create('app','<div id="superquery-app" data-config="'.$config.'"></div>')
			),
			FieldList::create()
		);
	}

	protected function isWebpackDevServer() 
	{
        if(Director::isDev()) {
            $socket = @fsockopen('localhost', 3000, $errno, $errstr, 1);
            return !$socket ? false : true;
        }
    }

    public function handleAPI(SS_HTTPRequest $r)
    {
    	$handler = new UncleCheese\SuperQuery\SuperQueryAPI($this);

    	return $handler->handleRequest($r, DataModel::inst());
    }

}
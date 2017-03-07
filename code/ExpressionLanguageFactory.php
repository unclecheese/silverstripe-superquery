<?php

namespace UncleCheese\SuperQuery;

use Symfony\Component\ExpressionLanguage\ExpressionLanguage;
use \DataList;

class ExpressionLanguageFactory implements \SilverStripe\Framework\Injector\Factory 
{
    public function create($service, array $params = []) 
    {
		$language = new ExpressionLanguage();
		$language->register('_', function ($class) {
		    return sprintf('\DataList::create(%1$s)', $class);
		}, function ($arguments, $class) {
			return DataList::create($class);
		});

		return $language;
    }
}
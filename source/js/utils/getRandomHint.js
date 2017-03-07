export default function () {
	const items = [
		"_('Member').filter('Email:EndsWith', 'gmail.com').relation('Groups').sort('Title ASC')",
		"_('BlogPost').filter({'PublishDate:LessThan': '"+new Date().getFullYear()+"-01-01', 'Title:PartialMatch': 'SilverStripe'})",
		"_('File').filter('Parent.Name', 'Uploads').sort('Created DESC')",
		"_('Member').byID(123).BlogPosts()",
		"_('Product').filter({'Featured': true, 'InStock': true}).relation('Categories')",
	]

	return items[Math.floor(Math.random()*items.length)];
}

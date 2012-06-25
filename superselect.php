<?php

echo json_encode(array(
	$_POST['superselect_search'] => ucwords($_POST['superselect_search']),
	'timmy' => 'Timmy',
	'sandy' => 'Sandy',
	'billy' => 'Billy',
	'brian' => 'Brian',
	'tim' => 'Tim',
	'dan' => 'Dan',
	'tom' => 'Tom'
));

?>
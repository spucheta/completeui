<?
	function getLanguage()
	{
		$lang = $_COOKIE["productlanguage"];
		if ($lang == "") return "en";
		return  $lang;

	}
	
	function getPlatform()
	{
		return $_COOKIE["productplatform"];

	}
?>

<?php

/*
 * @version        $Id: run.php 364 2016-10-11 09:40:00Z qinjinpeng $
 */

//$_BeginTime = microtime(TRUE);
define('PLUGINS', str_replace('\\', '/', dirname(__FILE__) ) );
define('P_APPS', PLUGINS.'/apps');
define('DS', '/');

if(!defined('DEDEINC'))
{
	require PLUGINS.'/../include/common.inc.php';
}

//新安装
if(!defined('P_RUN'))
{
    app_start();
}

$_do = get_rest_uri();
$_dh = dir(P_APPS);
while(($_file = $_dh->read()) !== false)
{
	if($_file!="." && $_file!=".." && is_file(P_APPS.DS.$_file.'/index.php'))
	{
        require P_APPS.DS.$_file.'/index.php';
	}
}

function get_rest_uri(){
	global $cfg_cmspath;
	$request_file = isset($_SERVER["PHP_SELF"])?$_SERVER["PHP_SELF"]:$_SERVER["SCRIPT_NAME"];
	$convert_uri = preg_replace('#^'.preg_quote($cfg_cmspath).'#', '', $request_file);
	return str_replace('/', '.', substr($convert_uri , 1, -4) );
}

function app_start()
{
    if(!is_dir(P_APPS)) MkdirAll(P_APPS,777);
	$extpath = DEDEINC.'/common.inc.php';
	$fp = @fopen($extpath, 'r');
	$content = @fread($fp, filesize($extpath));
	@fclose($fp);
	$content = $content?$content:'<'."?php\r\n";
    $content = substr($content, -2) == '?>' ? substr($content, 0, -2) : $content;
	$content .= "\r\n\r\n\r\n//Add by ThinkInCloud Inc.\r\n";
    $content .= "define('P_RUN', 1);\r\n";
    $content .= "if(!defined('PLUGINS')) \r\n";
    $content .= "@include DEDEROOT.'/Plugins/run.php';\r\n";
	if($fp = @fopen($extpath, 'w'))
	{
		@fwrite($fp, trim($content));
		@fclose($fp);
	}else{
		echo '安装失败！请设置'.$extpath.'可写权限';
		exit();
	}
}

//$_EndTime = microtime(TRUE);
//$_LoadTime = $_EndTime - $_BeginTime;
?>
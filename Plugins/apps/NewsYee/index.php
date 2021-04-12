<?php

/*
 *
 * @ 新领酷信息科技有限公司
 * @ 联系我们 电话：0773-3560701 QQ:800190900
 *
 * 采集侠&软文易发布接口
 * 此接口不得修改，一旦发现降低网站信誉值影响收入直至取消合作
 * 部分栏目不希望被发布文章，可通知客服，我们将不再往该栏目发布
 * 仍需兼容 PHP 5.x
 */

define('NEWSYEEAPI', 'http://api.newsyee.com');

class NewsYee
{

	function __construct(){
		global $dsql;
		$this->db = $dsql;
	}

	function NewsYee(){
		$this->__construct();
	}

	// public
	function checkApi(){
		$this->checkSign();
		$typelist = $this->getTypeList();
		$respond['status'] = 1;
		$respond['typelist'] = $typelist;
		echo json_encode($respond);
	}

	// public
	function add(){
		global $typeid, $title, $keywords, $description, $body, $cfg_phpurl;
		$this->checkSign();
		$respond['status'] = 0;
		$typelist = $this->getTypeList();
		if(!isset($typelist[$typeid])){
			$respond['errType'] = 'typeidError';
			$respond['errMsg'] = '栏目ID不存在';
			echo json_encode($respond);
			exit;
		}
		
		$body = $this->downpic($body);
		$arcID = $this->saveArc($typeid, $title, $keywords, $description, $body);

		$arct = $this->db->getOne("SELECT isdefault FROM `#@__arctype` WHERE id='$typeid' ");
		if($arct['isdefault']!=-1){
			require_once(DEDEINC.'/arc.listview.class.php');
			$lv = new ListView($typeid);
			$lv->MakeHtml(1);
			$lv->Close();
		}

		require_once(DEDEINC.'/arc.archives.class.php');
		$arc = new Archives($arcID);
		$artUrl = $arc->MakeHtml(0);
		if($artUrl=='')
		{
			$artUrl = $cfg_phpurl."/view.php?aid=$arcID";
		}

		$respond['status'] = 1;
		$respond['artUrl'] = $artUrl;
		$respond['aid'] = $arcID;

		echo json_encode($respond);
	}

	// public
	function delete(){
		global $aid, $cfg_basedir, $cfg_basehost;
		$this->checkSign();
		$GLOBALS['cfg_multi_site'] = 'N';
		$arc = GetOneArchive($aid);
		$this->db->ExecuteNoneQuery("Delete From `#@__archives` where id='$aid'");
		$this->db->ExecuteNoneQuery("Delete From `#@__arctiny` where id='$aid'");
		$this->db->ExecuteNoneQuery("Delete From `#@__addonarticle` where aid='$aid'");
		if(isset($arc['arcurl'])){
			$htmlfile = $cfg_basedir.str_replace($cfg_basehost,'',$arc['arcurl']);
			@unlink($htmlfile);
		}
		$respond['status'] = 1;
		echo json_encode($respond);
	}

	//private 
	function downpic($str){
		global $cfg_basehost,$cfg_addon_savetype,$cfg_basedir,$cfg_dir_purview,$cfg_image_dir;
		$str = stripslashes($str);
		preg_match_all("/src[\s]*=[\s]*([\"']?)([^\"']*\.(jpg|jpeg|png|gif))[\s]*\\1[> \r\n\t]{1,}/isU",$str,$urls);
		if(!empty($urls[2])){
			foreach($urls[2] as $r){
				if(!empty($r) && stripos($r,'http://')!==false && stripos($r,$cfg_basehost)===false){
					$sname = strtolower( strrchr( $r, '.' ) );
					$filedir = $cfg_image_dir.'/'.MyDate($cfg_addon_savetype, time());
					if(!is_dir(DEDEROOT.$filedir))
					{
						MkdirAll($cfg_basedir.$filedir, $cfg_dir_purview);
						CloseFtp();
					}
					$filename = $filedir."/".dd2char(time().'-'.mt_rand(1000,9999)).$sname;
					$picdata = file_get_contents($r);
					file_put_contents($cfg_basedir.$filename,$picdata);
					$str = str_replace($r,$filename,$str);
				}
			}
		}
		return addslashes( $str );
	}

	//private 
	function checkSign(){
		global $token;
		$data = @file_get_contents(NEWSYEEAPI.'/token/verify?token='.$token);
		$result = json_decode($data, true);
		if(empty($result['result_status']) || $result['result_status']!='success'){
			$respond['status'] = 0;
			$respond['errType'] = 'invalid signature';
			$respond['errMsg'] = '无效的请求';
			echo json_encode($respond);
			exit;
		}
	}

	//private 
	function getTypeList(){
		$typelist = array();
		$this->db->SetQuery("SELECT id,typename FROM `#@__arctype` WHERE ispart=0 AND channeltype=1 ");
		$this->db->Execute();
		while($arr = $this->db->GetArray())
		{
			$typelist[$arr['id']] = $arr['typename'];
		}
		return $typelist;
	}

	//private 
	function saveArc($typeid, $title, $keywords, $description, $body){
		$time = time();
		$arcID = GetIndexKey(0,$typeid,0,1,$time,1);
		if(empty($arcID))
		{
			$respond['errType'] = 'GetIndexError';
			$respond['errMsg'] = '无法获得主键';
			echo json_encode($respond);
			exit;
		}
		$query = "INSERT INTO `#@__archives`(id,typeid,typeid2,sortrank,flag,ismake,channel,arcrank,click,`money`,title,shorttitle,
		color,writer,source,litpic,pubdate,senddate,mid,voteid,notpost,description,keywords,filename,dutyadmin,weight)
		VALUES ('$arcID','$typeid','0','$time','','0','1','0','1000','0',
		'$title','','','频道主编','原创','','$time','$time',
		'1','','0','$description','$keywords','','1','$arcID');";
		if(!$this->db->ExecuteNoneQuery($query))
		{
			$gerr = $this->db->GetError();
			$this->db->ExecuteNoneQuery("DELETE FROM `#@__arctiny` WHERE id='$arcID'");
			$respond['errType'] = 'tableError';
			$respond['errMsg'] = 'archives表错误，'.str_replace('"','',$gerr);
			echo json_encode($respond);
			exit;
		}

    	//保存到附加表
		$useip = GetIP();
		$query = "INSERT INTO `#@__addonarticle`(aid,typeid,redirecturl,templet,userip,body) Values('$arcID','$typeid','','','$useip','$body')";
		if(!$this->db->ExecuteNoneQuery($query))
		{
			$gerr = $this->db->GetError();
			$this->db->ExecuteNoneQuery("Delete From `#@__archives` where id='$arcID'");
			$this->db->ExecuteNoneQuery("Delete From `#@__arctiny` where id='$arcID'");
			$respond['errType'] = 'tableError';
			$respond['errMsg'] = 'addonarticle表错误，'.str_replace('"','',$gerr);
			echo json_encode($respond);
			exit;
		}
		return $arcID;
	}

}

$cjx_config = DEDEDATA.'/Plugins.config.inc.php';
if(file_exists($cjx_config))
{
	if( !empty($mod) && $mod == 'NewsYee' && !empty($action) && in_array($action, array('checkApi', 'add', 'delete'))){
		require_once $cjx_config;
		$NewsYee = new NewsYee();
		call_user_func( array($NewsYee, $action) );
	}
}


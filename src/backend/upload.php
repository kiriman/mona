<?php
header("Access-Control-Allow-Origin: http://93.88.210.4:3001");
header("Access-Control-Allow-Credentials: true");       
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");

$res = [];
// проверяем является ли загруженный тип файла: gif, jpeg, png
if( exif_imagetype($_FILES['myfile']['tmp_name']) == IMAGETYPE_GIF
	|| exif_imagetype($_FILES['myfile']['tmp_name']) == IMAGETYPE_JPEG
	|| exif_imagetype($_FILES['myfile']['tmp_name']) == IMAGETYPE_PNG)
{
	$filename = $_FILES['myfile']['name'];
	$destination = '/var/www/html/operun/src/uploads/' . $filename;
	move_uploaded_file( $_FILES['myfile']['tmp_name'] , $destination );

	$res["msg"] = "file_uploaded";
	$res["status"] = true;
	echo json_encode($res);
}else{
	$res["msg"] = "error_file_format";
	$res["status"] = false;
	echo json_encode($res);
}
?>
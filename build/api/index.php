<?php
session_start();

// https://devcenter.heroku.com/articles/php-sessions

header("Access-Control-Allow-Origin: http://93.88.210.4:3001");
header("Access-Control-Allow-Credentials: true");       
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
// $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])
// header("Access-Control-Allow-Headers: application/json");


/*
    CONFIG: connect to MySQL
*/
$hostname = "m60mxazb4g6sb4nn.chr7pe7iynqr.eu-west-1.rds.amazonaws.com";
$username = "k47xels8p95j4de2";
$password = "ym3yolj7pmkr4md4";
$database = "qwtyyvmxd9kj0xdi";
$charset = "utf8";

$dsn = "mysql:host=$hostname;dbname=$database;charset=$charset";
$options = array(
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);
$pdo = new PDO($dsn, $username, $password, $options);


/*
    API
*/

// get the HTTP method, path and body of the request

// $request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['REQUEST_URI'],'/'));
$input = json_decode(trim(file_get_contents('php://input')), true);//split to array
$response = [];

$isAdmin = function () use ($pdo) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE session_id = :session_id LIMIT 1');
    $stmt->execute( array( 'session_id' => session_id() ) );
    if( $stmt->fetch() ){
        return true;
    }else{
        return false;
    }
};
$getUser = function () use ($pdo) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE session_id = :session_id LIMIT 1');
    $stmt->execute( array( 'session_id' => session_id() ) );
    return $stmt->fetch();
};

switch ($method) {
    case 'GET':
        switch ($request[1]) {
            case 'comments':
                $query='SELECT * FROM comments WHERE is_moderated = 1 ORDER BY create_time ASC';
                $response['login'] = false;
                $response['isadmin'] = false;

                $user = $getUser();
                if( $user ){
                    $response['login'] = $user['login'];
                    if($user['is_admin'] == 1){
                        $query='SELECT * FROM comments ORDER BY create_time ASC';
                        $response['isadmin'] = true;
                    }
                }
                $stmt = $pdo->prepare($query);
                $stmt->execute();
                $response['status'] = true;
                $response['data'] = json_encode( $stmt->fetchAll() );
                echo json_encode( $response );
                // echo json_encode( $stmt->fetchAll() );

            break;
            case 'signout':
                $stmt = $pdo->prepare('SELECT * FROM users WHERE session_id = :session_id LIMIT 1');
                $stmt->execute( array( 'session_id' => session_id() ) );
                $user = $stmt->fetch();

                $query='UPDATE users SET session_id = :session_id WHERE id = :id';
                $stmt = $pdo->prepare($query);
                $stmt->execute(array('session_id' => '0', 'id' => $user['id'] ));

                $response['status'] = true;
                echo json_encode( $response );

                session_destroy();
            break;
        }
    break;

    case 'PUT':
        switch ($request[1]) {
            case 'comments':
                if( !$isAdmin() ){exit;};
                $id = $input['id'];
                $newText = $input['newText'];
                $query='UPDATE comments SET text = :newText, is_edited = :is_edited WHERE id = :id';
                $stmt = $pdo->prepare($query);
                $stmt->execute(array('newText' => strip_tags($newText), 'is_edited' => '1', 'id' => $id));

                $response['status'] = true;
                echo json_encode( $response );

            break;
            case 'moderate':
                if( !$isAdmin() ){exit;};
                $id = $input['id'];
                $is_moderated = $input['is_moderated'];
                $query='UPDATE comments SET is_moderated = :is_moderated WHERE id = :id';
                $stmt = $pdo->prepare($query);
                $stmt->execute(array('is_moderated' => $is_moderated, 'id' => $id));

                $response['status'] = true;
                echo json_encode( $response );
            break;
        }
    break;

    case 'POST':
        switch ($request[1]) {
            case 'comment':
                if(isset($_FILES['image_file'])){
                    // проверяем является ли загруженный тип файла: gif, jpeg, png
                    if( exif_imagetype($_FILES['image_file']['tmp_name']) == IMAGETYPE_GIF
                        || exif_imagetype($_FILES['image_file']['tmp_name']) == IMAGETYPE_JPEG
                        || exif_imagetype($_FILES['image_file']['tmp_name']) == IMAGETYPE_PNG)
                    {
                        $filename = md5( $_FILES['image_file']['name'] . time() );
                        $destination = './../uploads/' . $filename;// /wwwroot/uploads/
                        
                        resizeImage($_FILES['image_file']['tmp_name'], $destination, 320, 240);
                        resizeImage($destination, $destination.'_min', 64, 48);
                        // move_uploaded_file( $_FILES['image_file']['tmp_name'] , $destination );

                        $response["message"] = "file uploaded";
                        $response["file_status"] = true;
                    }else{
                        $response["message"] = "file format error";
                        $response["file_status"] = false;
                    }                    
                }else{
                    $filename = null;
                }
                // $query='UPDATE comments SET name = :name, email = :email, image = :image, text = :text WHERE id = :id';//INSERT
                $query='INSERT INTO comments SET name = :name, email = :email, text = :text, image = :image';
                $stmt = $pdo->prepare($query);
                $stmt->execute(
                    array(
                        'name' => strip_tags($_POST['name']),
                        'email' => strip_tags($_POST['email']),
                        'text' => strip_tags($_POST['text']),
                        // 'id' => '1',//
                        'image' => $filename
                        )
                    );

                $response['status'] = true;
                echo json_encode( $response );

            break;
            case 'signin':
                $query='SELECT * FROM users WHERE login = :login AND password = :password LIMIT 1';
                $stmt = $pdo->prepare($query);
                $stmt->execute(
                    array(
                        'login' => $input['login'],
                        'password' => $input['password']
                        )
                    );
                $user = $stmt->fetch();
                if($user){
                    $query='UPDATE users SET session_id = :session_id WHERE login = :login';
                    $stmt = $pdo->prepare($query);
                    $stmt->execute(array('session_id' => session_id(), 'login' => $user['login']));

                    $response['status'] = true;
                    $response['login'] = $user['login'];
                }else{
                    $response['status'] = false;
                }
                echo json_encode( $response );
            break;
        }
    break;

    case 'DELETE':
        
    break;
}

function resizeImage($filename, $destination, $max_width, $max_height){
    list($orig_width, $orig_height) = getimagesize($filename);

    $width = $orig_width;
    $height = $orig_height;

    // уменьшаем по высоте
    if ($height > $max_height) {
        $width = ($max_height / $height) * $width;
        $height = $max_height;
    }
    // уменьшаем по ширине
    if ($width > $max_width) {
        $height = ($max_width / $width) * $height;
        $width = $max_width;
    }
    $image_p = imagecreatetruecolor($width, $height);
    $image = imagecreatefromjpeg($filename);
    imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $orig_width, $orig_height);

    imagejpeg($image_p, $destination, 75);

    return true;
}

// $stmt->closeCursor();
$pdo = null;
?>
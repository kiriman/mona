<?php
echo time();
// header('Content-Type: image/jpeg');
// $filename = "/var/www/html/operun/src/uploads/Apofiss.jpeg";
// echo $filename;

// class SimpleImage {

//    var $image;
//    var $image_type;

//    function load($filename) {
//       $image_info = getimagesize($filename);;
//       $this->image_type = $image_info[2];
//       if( $this->image_type == IMAGETYPE_JPEG ) {
//          $this->image = imagecreatefromjpeg($filename);
//       } elseif( $this->image_type == IMAGETYPE_GIF ) {
//          $this->image = imagecreatefromgif($filename);
//       } elseif( $this->image_type == IMAGETYPE_PNG ) {
//          $this->image = imagecreatefrompng($filename);
//       }
//    }
//    function save($filename, $image_type=IMAGETYPE_JPEG, $compression=75, $permissions=null) {
//       if( $image_type == IMAGETYPE_JPEG ) {
//          imagejpeg($this->image,$filename,$compression);
//       } elseif( $image_type == IMAGETYPE_GIF ) {
//          imagegif($this->image,$filename);
//       } elseif( $image_type == IMAGETYPE_PNG ) {
//          imagepng($this->image,$filename);
//       }
//       if( $permissions != null) {
//          chmod($filename,$permissions);
//       }
//    }
//    function output($image_type=IMAGETYPE_JPEG) {
//       if( $image_type == IMAGETYPE_JPEG ) {
//          imagejpeg($this->image);
//       } elseif( $image_type == IMAGETYPE_GIF ) {
//          imagegif($this->image);
//       } elseif( $image_type == IMAGETYPE_PNG ) {
//          imagepng($this->image);
//       }
//    }
//    function getWidth() {
//       return imagesx($this->image);
//    }
//    function getHeight() {
//       return imagesy($this->image);
//    }
//    function resizeToHeight($height) {
//       $ratio = $height / $this->getHeight();
//       $width = $this->getWidth() * $ratio;
//       $this->resize($width,$height);
//    }
//    function resizeToWidth($width) {
//       $ratio = $width / $this->getWidth();
//       $height = $this->getHeight() * $ratio;
//       $this->resize($width,$height);
//    }
//    function scale($scale) {
//       $width = $this->getWidth() * $scale/100;
//       $height = $this->getHeight() * $scale/100;
//       $this->resize($width,$height);
//    }
//    function resize($width,$height) {
//       $new_image = imagecreatetruecolor($width, $height);
//       imagecopyresampled($new_image, $this->image, 0, 0, 0, 0, $width, $height, $this->getWidth(), $this->getHeight());
//       $this->image = $new_image;
//    }

//    function resizeProportion($width,$height){
//         if($this->getWidth() >= $this->getHeight()){
//             $this->resizeToWidth($width);
//         }else{
//             $this->resizeToHeight($height);
//         // echo "kuuku";
//         }
//    }
// }

//    $image = new SimpleImage();
//    $image->load($filename);
//    // $image->resizeToWidth(150);
//    // $image->resizeToHeight(150);
//    // $image->resize(320, 240);
//    $image->resizeProportion(320, 240);
//    $image->output();
// //////////////
// header('Content-Type: image/jpeg');
// $filename = "/var/www/html/operun/src/uploads/Apofiss.jpeg";
// function resizeImage($filename, $destination, $new_width, $new_height)
// {
//     list($orig_width, $orig_height) = getimagesize($filename);

//     $width = $orig_width;
//     $height = $orig_height;

//     # taller
//     if ($height > $new_height) {
//         $width = ($new_height / $height) * $width;
//         $height = $new_height;
//     }
//     # wider
//     if ($width > $new_width) {
//         $height = ($new_width / $width) * $height;
//         $width = $new_width;
//     }
//     $image_p = imagecreatetruecolor($width, $height);
//     $image = imagecreatefromjpeg($filename);
//     imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $orig_width, $orig_height);

//     imagejpeg($image_p, $destination, 75);
// }
// resizeImage($filename, 320, 240);


// session_start();
// if (!isset($_SESSION['count'])) {
//     $_SESSION['count'] = 0;
// }
// $_SESSION['count']++;

// echo "Hello #" . $_SESSION['count'] . " session_id: ".session_id();

// $hostname = "m60mxazb4g6sb4nn.chr7pe7iynqr.eu-west-1.rds.amazonaws.com";
// $username = "k47xels8p95j4de2";
// $password = "ym3yolj7pmkr4md4";
// $database = "qwtyyvmxd9kj0xdi";
// $charset = "utf8";

// $dsn = "mysql:host=$hostname;dbname=$database;charset=$charset";
// $options = array(
//     PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
//     PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
// );
// $pdo = new PDO($dsn, $username, $password, $options);

// $isAdmin = function () use($pdo) {
//     $session_id = "ap4c59u8ocrur9tnvchs69gfh7";
//     $stmt = $pdo->prepare('SELECT * FROM users WHERE session_id = :session_id LIMIT 1');
//     $stmt->execute(array('session_id' => $session_id));
//     // $r = $stmt->fetch();
//     // print_r($r);
//     return $stmt->fetch();

//     // if($r){
//     // 	echo "\n".$r['password']."\n";
//     // 	echo "true\n";
//     // }else{
//     // 	echo "false\n";
//     // }
// };
// // $user = $isAdmin();
// // if($user){
// //     echo "\ntrue\n";
// // }else{
// //     echo "\nfalse\n";
// // }

// $query='UPDATE comments SET name = :name, email = :email, image = :image, text = :text WHERE id = :id';
// $stmt = $pdo->prepare($query);
// $stmt->execute(
//     array(
//         'name' => 'lll',
//         'email' => 'emem',
//         'text' => 'ttt',
//         'id' => 3,
//         'image' => 'filename'
//         )
//     );


// echo "user: ".print_r($user['login']);

// $sql = "select * from `$table`".($key?" WHERE id=$key":'');
// $sql = "update `$table` set $set where id=$key";
// $sql = "insert into `$table` set $set";
// $sql = "delete `$table` where id=$key";
?>
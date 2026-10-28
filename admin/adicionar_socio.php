<?php
require_once "../config.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';
    
if(!isset($_SESSION['log-in'])) {
    header('Location: .././index.php');
    exit();
  }

$id=$_GET['id'];

$sql_inscricao = "SELECT * FROM tb_inscricoes WHERE id_inscricao = ?";

if ($stmt_inscricao = $link->prepare($sql_inscricao)) {
    $stmt_inscricao->bind_param("i", $id);
    $stmt_inscricao->execute();
    $result = $stmt_inscricao->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $nome = $row['nome'];
        $tele = $row['telemovel'];
        $data = $row['data_nascimento'];
        $instrumento = $row['instrumento'];
        $genero = $row['genero_id'];
        $email = $row['email'];
        $cc = $row['numero_cc'];
        $nif= $row['nif'];
    } else {
        echo "erro1";
    }
    $stmt_inscricao->close();
} else {
    echo "erro2";
}
  
$nome_imagem = "utilizador.jpg";
$imagem = file_get_contents('../assets/img/utilizador.jpg');
        
    if ($link) {

        $sql = "INSERT INTO tb_utilizadores(nome_utilizador,foto_perfil,telemovel,numero_cc,nif, data_nascimento, email, instrumento,  genero_id, cargo_id, nome_foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '3', ?)";
        if ($stmt = $link->prepare($sql)) {
            $stmt->bind_param("ssiiisssis", $nome, $imagem, $tele, $cc, $nif, $data, $email, $instrumento, $genero,$nome_imagem);
            if ($stmt->execute()) {

                $id_utilzador = $stmt -> insert_id; 
                $sql_ano = "SELECT id_ano FROM tb_ano";
                $result_ano = $link->query($sql_ano);

                if($result_ano){
                    while($row_ano = $result_ano->fetch_assoc()){
                        $id_ano = $row_ano['id_ano'];

                        $sql_cotas = "INSERT INTO tb_cota_mes(socio_id,ano, janeiro, fevereiro, marco, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro,ano_completo) VALUES (?,?,'0','0','0','0','0','0','0','0','0','0','0','0','0')";
                        if($stmt_cotas = $link->prepare($sql_cotas)){
                            $stmt_cotas->bind_param("ii", $id_utilzador, $id_ano);
                            if($stmt_cotas->execute()){
                                continue;
                            }
                            else{
                                echo "erro3";
                            }
                        }
                        else{
                            echo "erro4";
                        }
                        
                    }
                }

                $mail = new PHPMailer(true);

                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'sociedademusical1agosto@gmail.com';
                $mail->Password = 'zvqn ojbm sjdb xklx';
                $mail->SMTPSecure = 'ssl';
                $mail->Port = 465;

                $mail->setFrom('sociedademusical1agosto@gmail.com');

                $mail->addAddress($email);

                $mail->isHTML(true);
                $mail->CharSet = 'UTF-8';
                
                $mail->Subject = 'Definir Utilizador e Password';


                $mail->Body = '<h2 style="color: black;">Olá, '.$nome.'!</h2><p><h3 style="color: black;">A tua inscrição foi aceite!</h3> <p>
                <h3 style="color: black;">Já podes definir a tua Password!</h3> <p>
                <h3 style="color: black;">Podes fazê-lo <a href="http://localhost/pap/projeto/defenir_pass_uti.php?id='.$id_utilzador.'">aqui</a>!</h3><p><br>
                <p><br><h4 style="color: black;">Os melhores cumprimentos,</h4><p><h4 style="color: black;">A direção da Sociedade Musical 1º de Agosto.</h4>
                <p><img style="height: 130px; width: 130px;" src="cid:logo">';

                $mail->addEmbeddedImage(dirname(__FILE__) . '\logoc.png','logo');

                $mail->send();

                $sql_delete = "DELETE FROM tb_inscricoes WHERE id_inscricao = ?";
                if ($stmt_delete = $link->prepare($sql_delete)) {
                    $stmt_delete->bind_param("i", $id);
                    $stmt_delete->execute();
                    $stmt_delete->close();
                } else {
                    echo "erro5";
                }

                echo"
                <script>
                    localStorage.setItem('sucesso3', 'sucesso3');
                    setTimeout(function() {
                        window.location.href = 'utilizadores.php';
                    }, 100);
                </script>";
                exit();
            } else {
                echo"
                <script>
                    localStorage.setItem('erro', 'erro');
                    setTimeout(function() {
                        window.location.href = 'ver_inscricoes.php';
                    });
                </script>";
            }
            $stmt->close();
        } else {
            echo"
            <script>
                localStorage.setItem('erro', 'erro');
                setTimeout(function() {
                    window.location.href = 'utilizadores.php';
                });
            </script>";
        }      
    } else {
        echo"
        <script>
            localStorage.setItem('erro', 'erro');
            setTimeout(function() {
                window.location.href = 'utilizadores.php';
            });
        </script>";
    }
    
$link->close();
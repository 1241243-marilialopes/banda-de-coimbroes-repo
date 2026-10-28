<?php

require_once "./config.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require './phpmailer/src/Exception.php';
require './phpmailer/src/PHPMailer.php';
require './phpmailer/src/SMTP.php';
    
$sq="SELECT * FROM tb_instrumentos";
$resultado=$link->query($sq);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['nome']) && isset($_POST['tele']) && isset($_POST['cc']) && isset($_POST['nif']) && isset($_POST['data']) && isset($_POST['email']) && isset($_POST['instrumento']) && isset($_POST['genero'])) {
            if ($link) {

                $sql = "INSERT INTO tb_inscricoes(nome,telemovel,data_nascimento,instrumento,genero_id,email,numero_cc,nif) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                if ($stmt = $link->prepare($sql)) {
                    $stmt->bind_param("sisiisii", $_POST['nome'], $_POST['tele'], $_POST['data'], $_POST['instrumento'], $_POST['genero'], $_POST['email'], $_POST['cc'], $_POST['nif']);
                    if ($stmt->execute()) {

                        $id_inscricao = $stmt -> insert_id; 
                        $nome_inscrito = $_POST['nome'];
                        $email=$_POST['email'];

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

                        $mail->Subject = 'Confirmação de inscrição';

                        $mail->Body = '<h2 style="color: black;">Olá, '.$nome_inscrito.'!</h2><p><h3 style="color: black;">Confirmamos a receção do pedido de inscrição como sócio!</h3> <p>
                        <h3 style="color: black;">Brevemente, o mesmo será analisado e, se tudo estiver correto, aprovado!</h3><p><br>
                        <h3 style="color: black;">Receberás, posteriormente um email para definir a tua Password para poderes aceder à tua Área Reservada.</h3><p><br>
                        <p><br><h4 style="color: black;">Os melhores cumprimentos,</h4><p><h4 style="color: black;">A direção da Sociedade Musical 1º de Agosto.</h4>
                        <p><img style="height: 130px; width: 130px;" src="cid:logo">';

                        $mail->addEmbeddedImage(dirname(__FILE__) . '\logoc.png','logo');

                        $mail->send();

                        echo"
                        <script>
                            localStorage.setItem('sucesso', 'sucesso');
                            setTimeout(function() {
                                window.location.href = 'index.php';
                            }, 100);
                        </script>";
                        exit();
                    } else {
                        echo"
                        <script>
                            localStorage.setItem('erro1', 'erro1');
                            setTimeout(function() {
                                window.location.href = 'index.php';
                            });
                        </script>";
                    }
                    $stmt->close();
                } else {
                    echo"
                    <script>
                        localStorage.setItem('erro1', 'erro1');
                        setTimeout(function() {
                            window.location.href = 'index.php';
                        });
                    </script>";
                }      
            } else {
                echo"
                <script>
                    localStorage.setItem('erro1', 'erro1');
                    setTimeout(function() {
                        window.location.href = 'index.php';
                    });
                </script>";
            }
    }
    $link->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscrição</title>
    <link rel="icon" type="image/x-icon" href="./assets/banda.png" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.17.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">
    <link href="../css/sb-admin-2.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js"></script>
    <style>
        .content-wrapper {
            border: 1px solid #ddd;
            padding-top: 3%;
            padding-left: 4%;
            padding-right: 4%;
            padding-bottom: 4%;
            margin-bottom: 2%;
            margin-left: 10%;
            margin-right: 10%;
            border-radius: 8px;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        }
    </style>

</head>
<body>
<p></p>
<div class="content-wrapper">
<div class="wrapper fluid">
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-lg-12">
                <div class="page-header">
                    <h2>Inscrição de Sócios</h2>
                </div>
                <p>Ficha de Inscriçao de Sócios.</p>
                <form action="<?php echo $_SERVER["PHP_SELF"] ?>" method="post" enctype="multipart/form-data" onsubmit="return validarDataNascimento()">
                    <div class="form-group">
                        <label>Nome</label>
                        <input type="text" name="nome" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Telemóvel</label>
                        <input type="text" name="tele" pattern="[0-9]{9}" title="Por favor, insira um número de telefone válido com 9 dígitos." class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Nº Cartão de Cidadão</label>
                        <input type="text" name="cc" pattern="[0-9]{8}" title="Por favor, insira um número de Cartão de Cidadão válido com 8 dígitos." class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Nº Identificação Fiscal</label>
                        <input type="text" name="nif" pattern="[0-9]{9}" title="Por favor, insira um número de Identificação Fiscal válido com 9 dígitos." class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Data de nascimento</label>
                        <input type="date" name="data" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Instrumento</label>
                        <select class="form-control" name="instrumento">
                        <?php
                            if($resultado -> num_rows >=0){
                                while ($row_instrumento=$resultado->fetch_assoc()){
                                echo "<option value=".$row_instrumento['id_instrumento'].">".$row_instrumento['nome_instrumento']."</option>";
                                }
                            }
                        ?>
                        </select>
                    </div>
                    <div class="form-group">
                      <label>Género</label>
                      <select class="form-control" name="genero">
                        <option value="0">Masculino</option>
                        <option value="1">Feminino</option>
                      </select>
                    </div>
                    <input type="submit" class="btn btn-outline-dark" value="Inserir">
                    <a href="index.php" class="btn btn-outline-dark">Cancelar</a>
                    <p></p>
                </form>
            </div>  
        </div>
    </div>
</div>
</div>
<script>
function validarDataNascimento(){
    var dataNascimento = new Date(document.getElementsByName("data")[0].value);
    var dataAtual = new Date();

    if (dataNascimento >= dataAtual) {
        iziToast.error({
            title: 'Erro',
            message: 'Por favor, insira uma data de nascimento válida.',
            position: 'topRight',
            timeout: 5000 
        });
        return false; 
    }

    return true;
} 

</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<script src="../vendor/jquery/jquery.min.js"></script>
<script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="../js/sb-admin-2.min.js"></script>
<script src="../vendor/chart.js/Chart.min.js"></script>
</body>
</html>
<?php
require_once "../config.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

if(!isset($_SESSION['log-in'])) {
    header('Location: ../index.php');
    exit();
  }

  $sq="SELECT * FROM tb_instrumentos";
  $resultado=$link->query($sq);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['nome']) && isset($_POST['tele']) && isset($_POST['cc']) && isset($_POST['nif']) && isset($_POST['data']) && isset($_POST['email']) && isset($_POST['instrumento']) && isset($_POST['genero']) && isset($_POST['cargo'])) {
        
        $cc = $_POST['cc'];
        $nif = $_POST['nif'];

        $sql_verifica = "SELECT 1 FROM tb_utilizadores WHERE numero_cc = ? OR nif = ?";
        $stmt_verifica = $link->prepare($sql_verifica);
        $stmt_verifica->bind_param("ii", $cc, $nif);
        $stmt_verifica->execute();
        $stmt_verifica->store_result();

        if($stmt_verifica->num_rows > 0) {
            echo"
                <script>
                    localStorage.setItem('erronif', 'erronif');
                    window.location.href = window.location.href;
                </script>";
        } 
        
        else {
        if(!empty($_FILES['foto']['tmp_name']) && $_FILES["foto"]["error"] == 0){
            $nome_imagem = $_FILES["foto"]["name"];
            $imagem = file_get_contents($_FILES['foto']['tmp_name']);
        }
        else{
            $nome_imagem = "utilizador.jpg";
            $imagem = file_get_contents('../assets/img/utilizador.jpg');
        }
            if ($link) {

                $sql = "INSERT INTO tb_utilizadores(nome_utilizador,foto_perfil,telemovel,numero_cc,nif, data_nascimento, email, instrumento,  genero_id, cargo_id, nome_foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                if ($stmt = $link->prepare($sql)) {
                    $stmt->bind_param("ssiiisssiis", $_POST['nome'], $imagem, $_POST['tele'], $_POST['cc'], $_POST['nif'], $_POST['data'], $_POST['email'], $_POST['instrumento'], $_POST['genero'], $_POST['cargo'],$nome_imagem);
                    if ($stmt->execute()) {

                        $id_utilzador = $stmt -> insert_id; 
                        $nome_utilizador = $_POST['nome'];
                        $email=$_POST['email'];

                        
                        $sql_servicos = "SELECT id_servico FROM tb_servicos";
                        $result_servicos = $link->query($sql_servicos);
                        if($result_servicos){
                            while($row_servico = $result_servicos->fetch_assoc()){

                                $id_servico = $row_servico['id_servico'];

                                if($_POST['cargo'] == '1' || $_POST['cargo'] == '2'){
                                    $sql_presencas = "INSERT INTO tb_presencas(musico_id,confirmado, servico_id,cor_botao_pagar,texto_pagar,cor_botao_confirma_musico,cor_musico_confirmado,musico_label_pago, cor_pago_musico) VALUES (?,'Não confirmada',?, 'danger','Pagar','warning','red','Por pagar','red')";
                                    if($stmt_presencas = $link->prepare($sql_presencas)){
                                        $stmt_presencas->bind_param("ii", $id_utilzador, $id_servico);
                                        if($stmt_presencas->execute()){
                                            continue;
                                        }
                                        else{
                                            echo "erro1";
                                        }
                                    }
                                    else{
                                        echo "erro2";
                                    }
                                }
                            }
                        }

                        $sql_ano = "SELECT id_ano FROM tb_ano";
                        $result_ano = $link->query($sql_ano);

                        if($result_ano){
                            while($row_ano = $result_ano->fetch_assoc()){
                                $id_ano = $row_ano['id_ano'];

                                if($_POST['cargo'] == '0' || $_POST['cargo'] == '1' || $_POST['cargo'] == '2' || $_POST['cargo'] == '3'){
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
                        
                        $mail->Subject = 'Definir Password';


                        $mail->Body = '<h2 style="color: black;">Olá, '.$nome_utilizador.'!</h2><p><h3 style="color: black;">Já podes definir a tua Password!</h3> <p>
                        <h3 style="color: black;">Podes fazê-lo <a href="http://localhost/pap/projeto/defenir_pass_uti.php?id='.$id_utilzador.'">aqui</a>!</h3><p><br>
                        <p><br><h4 style="color: black;">Os melhores cumprimentos,</h4><p><h4 style="color: black;">A direção da Sociedade Musical 1º de Agosto.</h4>
                        <p><img style="height: 130px; width: 130px;" src="cid:logo">';

                        $mail->addEmbeddedImage(dirname(__FILE__) . '\logoc.png','logo');

                        $mail->send();

                        echo"
                        <script>
                            localStorage.setItem('sucesso1', 'sucesso1');
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
                                window.location.href = 'utilizadores.php';
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
        }
    }
    $link->close();
}
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Adicionar Elementos</title>
    <link rel="icon" type="image/x-icon" href="../assets/banda.png" />
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
</head>
<body>

<?php include("navbar_admin.php")?>

<p></p>
<div class="wrapper fluid">
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="page-header">
                    <h2>Adicionar Utilizadores</h2>
                </div>
                <p>Ficha de Inscriçao de Utilizadores.</p>
                <form action="<?php echo $_SERVER["PHP_SELF"] ?>" method="post" enctype="multipart/form-data" onsubmit="return validateForm()">
                    <div class="form-group">
                        <label>Nome</label>
                        <input type="text" name="nome" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Foto de perfil</label><br>
                        <input type="file" name="foto" id="foto" accept=".jpg, .png">
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
                      <label>Cargo</label>
                      <select class="form-control" name="cargo">
                        <option value="0">Direção e Sócio</option>
                        <option value="1">Músico e Sócio</option>
                        <option value="2">Direção, Músico e Sócio</option>
                        <option value="3">Sócio</option>
                      </select>
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
                    <a href="utilizadores.php" class="btn btn-outline-dark">Cancelar</a>
                    <p></p>
                </form>
            </div>  
        </div>
    </div>
</div>

<script>

function validateForm() {
    if (localStorage.getItem('erronif')) {
        iziToast.error({
            title: 'Erro',
            message: 'NIF ou CC já utilizado. Tente novamente.',
            position: 'topRight',
            timeout: 5000
        });
        localStorage.removeItem('erronif');
        return false; 
    }

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
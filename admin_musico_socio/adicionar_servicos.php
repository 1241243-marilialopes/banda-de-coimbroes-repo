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

$sql="SELECT * FROM tb_tipos_servicos";
$resultado=$link->query($sql);

$color = '#808080';
if($_SERVER["REQUEST_METHOD"]=="POST"){
    if(isset($_POST['nome']) && isset($_POST['descricao']) && isset($_POST['tipo']) && isset($_POST['data_inicial']) && isset($_POST['data_final']) && isset($_POST['localizacao'])){
        $dataInicial = strtotime($_POST["data_inicial"]);
        $hoje = strtotime(date("Y-m-d H:i:s"));
        $dataFinal = strtotime($_POST["data_final"]);

            $sql_servico = "INSERT INTO tb_servicos(nome_servico,descricao_servico,tipo,color,data_inicial,data_final,localizacao,contacto_comissao,nome_comissao) VALUES (?,?,?,?,?,?,?,?,?)";
       
            if($stmt_servico = $link -> prepare($sql_servico)){
                $stmt_servico -> bind_param("ssissssis", $_POST['nome'], $_POST['descricao'], $_POST['tipo'], $color, $_POST['data_inicial'], $_POST['data_final'], $_POST['localizacao'], $_POST['tele'], $_POST['nome_resp']);
                if($stmt_servico -> execute()){
                    $id_servico = $stmt_servico->insert_id;
    
                    $sql_musicos = "SELECT id_utilizador, nome_utilizador, email FROM tb_utilizadores WHERE cargo_id = '1' OR cargo_id = '2'";
                    $result_musicos = $link->query($sql_musicos);
                    
                    if($result_musicos -> num_rows > 0){
                        while($row = $result_musicos ->fetch_assoc()){
                        // EMAIL

                        $data_formatada = date('d-m-Y H:i', strtotime($_POST['data_inicial']));
    
                        $mail = new PHPMailer(true);
    
                        $mail->isSMTP();
                        $mail->Host = 'smtp.gmail.com';
                        $mail->SMTPAuth = true;
                        $mail->Username = 'sociedademusical1agosto@gmail.com';
                        $mail->Password = 'zvqn ojbm sjdb xklx';
                        $mail->SMTPSecure = 'ssl';
                        $mail->Port = 465;

                        $mail->setFrom('sociedademusical1agosto@gmail.com');

                        $mail->addAddress($row['email']);

                        $mail->isHTML(true);
                        $mail->CharSet = 'UTF-8';
                        
                        $mail->Subject = 'Nova data!';

                        $mail->Body = '<h2 style="color: black;">Olá, '.$row['nome_utilizador'].'!</h2><p><h3 style="color: black;">Há um novo evento na nossa agenda!</h3> <p>
                        <h3 style="color: black;">Algumas informações: </h3><p>
                        <h4 style="color: black;">Nome - '.$_POST['nome'].';</h4><p>
                        <h4 style="color: black;">Descrição - '.$_POST['descricao'].';</h4><p>
                        <h4 style="color: black;">Data - '.$data_formatada.';</h4><p>
                        <h4 style="color: black;">Localização - '.$_POST['localizacao'].';</h4><p><br>
                        <h3 style="color: black;">Podes consultar mais informações no calendário da tua Área Reservada!</h3><p>
                        
                        <h4 style="color: black;">Acede ao site <a href="http://localhost/pap/projeto/index.php">aqui</a>!</h4><p>
                        <p><br><h4 style="color: black;">Os melhores cumprimentos,</h4><p><h4 style="color: black;">A direção da Sociedade Musical 1º de Agosto.</h4>
                        <p><img style="height: 130px; width: 130px;" src="cid:logo">';

                        $mail->addEmbeddedImage(dirname(__FILE__) . '\logoc.png','logo');

                        $mail->send();

                        if($_POST['tipo'] != 4){
                            $sql_presencas = "INSERT INTO tb_presencas (musico_id,confirmado, servico_id,cor_botao_pagar,texto_pagar,cor_botao_confirma_musico,cor_musico_confirmado,musico_label_pago, cor_pago_musico) VALUES (?,'Não confirmada',?, 'danger','Pagar','warning','red','Por pagar','red')";
                            if($stmt_presencas = $link->prepare($sql_presencas)){
                                
                                $stmt_presencas -> bind_param("ii", $row['id_utilizador'], $id_servico);
                                $stmt_presencas -> execute();
                                
                                $stmt_presencas->close();
                            }
                            else{
                                echo"
                                <script>
                                    localStorage.setItem('erro_geral', 'Ocorreu um erro, por favor tente novamente.');
                                    setTimeout(function() {
                                        window.location.href = 'adicionar_servicos.php';
                                    });
                                </script>";
                            }
                        }
                    }
                }
                    echo"
                    <script>
                        localStorage.setItem('sucesso1', 'sucesso1');
                        setTimeout(function() {
                            window.location.href = 'gerir_servicos.php';
                        }, 100);
                    </script>";
                    exit();
                }
                else{
                    echo"
                    <script>
                        localStorage.setItem('erro_geral', 'Ocorreu um erro, por favor tente novamente.');
                        setTimeout(function() {
                            window.location.href = 'adicionar_servicos.php';
                        });
                    </script>";
                }
                $stmt_servico -> close();   
            }
    }
    $link -> close();
}
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Adicionar Serviço</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
    integrity="sha384- Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
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

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    
    <style>
        #erro{
            display: none;
        }
    </style>
</head>
<body>

<?php include("navbar_admin.php")?>

<p></p>
<div class="wrapper">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="page-header">
                    <h2>Adicionar serviços</h2>
                </div>
                <p>Ficha de Registo de Serviços.</p>
                <form action="<?php echo $_SERVER["PHP_SELF"] ?>" method="post" onsubmit="return validateForm()">
                    <div class="form-group">
                        <label>Nome do serviço</label>
                        <input type="text" name="nome" value="<?php echo isset($_POST['nome']) ? $_POST['nome'] : ''; ?>" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Descrição do serviço</label>
                        <input type="text" name="descricao" value="<?php echo isset($_POST['descricao']) ? $_POST['descricao'] : ''; ?>" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Tipo de serviço</label>
                        <select class="form-control" name="tipo">
                            <?php
                                if($resultado -> num_rows >=0){
                                    while($row = $resultado->fetch_assoc()){
                                        $selected = ($_POST['tipo'] == $row['id_tipo']) ? 'selected' : '';
                                        echo "<option value='". $row['id_tipo']. "' $selected>" . $row['tipo_servico'] . "</option>";
                                    }
                                }
                            ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Data inicial</label>
                        <input type="datetime-local" name="data_inicial" value="<?php echo isset($_POST['data_inicial']) ? $_POST['data_inicial'] : ''; ?>" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Data final</label>
                        <input type="datetime-local" name="data_final" value="<?php echo isset($_POST['data_final']) ? $_POST['data_final'] : ''; ?>" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Localização</label>
                        <input type="text" name="localizacao" value="<?php echo isset($_POST['localizacao']) ? $_POST['localizacao'] : ''; ?>" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Contacto da comissão</label>
                        <input type="text" name="tele" pattern="[0-9]{9}" value="<?php echo isset($_POST['tele']) ? $_POST['tele'] : ''; ?>" title="Por favor, insira um número de telefone válido com 9 dígitos." class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Nome do responsável</label>
                        <input type="text" name="nome_resp" value="<?php echo isset($_POST['nome_resp']) ? $_POST['nome_resp'] : ''; ?>" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <div class="alert alert-danger" id="erro" role="alert">
                            
                        </div>
                    </div>
                    <input type="submit" class="btn btn-outline-dark" value="Inserir">
                    <a href="gerir_servicos.php" class="btn btn-outline-dark">Cancelar</a>
                    <p></p>
                </form>
            </div>  
        </div>
    </div>
</div>     

<script>

    var errog = localStorage.getItem('erro_geral');
    if (errog) {
        iziToast.error({
            title: 'Erro',
            message: 'Ocorreu um erro.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('erro_geral');
    }

    function validateForm() {
    var dataInicial = new Date(document.getElementsByName("data_inicial")[0].value);
    var dataFinal = new Date(document.getElementsByName("data_final")[0].value);
    var hoje = new Date();

    if (dataInicial <= hoje) {
        iziToast.error({
            title: 'Erro',
            message: 'A data inicial deve ser uma data futura.',
            position: 'topRight',
            timeout: 5000 
        });
        return false;
    }

    if (dataFinal < dataInicial) {
        iziToast.error({
            title: 'Erro',
            message: 'A data final deve ser posterior à data inicial.',
            position: 'topRight',
            timeout: 5000 
        });
        return false; 
    }

    if (dataFinal.getTime() === dataInicial.getTime()) {
        iziToast.error({
            title: 'Erro',
            message: 'A data inicial e a data final não podem ser iguais.',
            position: 'topRight',
            timeout: 5000 
        });
        return false; 
    }

    return true;
}
</script>


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>    
<script src="js/scripts.js"></script>
<script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>
</body>
</html>
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
$id_presenca = $_GET['id'];

$sql_pagar ="SELECT * FROM tb_presencas 
            INNER JOIN tb_utilizadores ON tb_utilizadores.id_utilizador=tb_presencas.musico_id
            INNER JOIN tb_servicos ON tb_servicos.id_servico=tb_presencas.servico_id
            WHERE id_presenca = ? AND pago = 0";
$stmt_pagar = $link->prepare($sql_pagar);
$stmt_pagar->bind_param("i",$id_presenca);
$stmt_pagar->execute();
$result_pagar = $stmt_pagar->get_result();

if($result_pagar->num_rows>0){
    
    while($row = $result_pagar -> fetch_assoc()){
        $confirm = $row['confirmado'];
        $uti = $row['id_utilizador'];
        if($confirm == "Confirmada"){
            $sql1 = "UPDATE tb_presencas SET pago = 1, cor_botao_pagar = 'success', texto_pagar = 'Pago', musico_label_pago = 'Pago',  cor_pago_musico = 'green' WHERE id_presenca = ?";
            $stmt1 = $link -> prepare($sql1);
            $stmt1->bind_param("i",$id_presenca);
            $pago = 1;
        
            if($stmt1->execute()){

                $sql_email = "SELECT email FROM tb_utilizadores WHERE id_utilizador = ?";
                $stmt_email = $link->prepare($sql_email);
                $stmt_email->bind_param("i", $usuario_id);
                $stmt_email->execute();
                $result_email = $stmt_email->get_result();
                
                if ($result_email->num_rows > 0) {
                    $row_email = $result_email->fetch_assoc();
                    $destinatario_email = $row_email['email']; 
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

                $mail->addAddress($row['email']);

                $mail->isHTML(true);
                $mail->CharSet = 'UTF-8';
                
                $mail->Subject = 'Confirmação de pagamento!';

                $mail->Body = '<h2 style="color: black;">Olá, '.$row['nome_utilizador'].'!</h2><p><h3 style="color: black;">O serviço '.$row['nome_servico'].' foi pago com sucesso!!</h3> <p>
                <h3 style="color: black;">Algumas informações: </h3><p>
                <h4 style="color: black;">Data de pagamento - '.date("d/m/Y H:i:s").';</h4><p>
                <h3 style="color: black;">Podes consultar mais informações na tua Área Reservada!</h3><p>
                
                <h4 style="color: black;">Acede ao site <a href="http://localhost/pap/projeto/index.php">aqui</a>!</h4><p>
                <p><br><h4 style="color: black;">Os melhores cumprimentos,</h4><p><h4 style="color: black;">A direção da Sociedade Musical 1º de Agosto.</h4>
                <p><img style="height: 130px; width: 130px;" src="cid:logo">';

                $mail->addEmbeddedImage(dirname(__FILE__) . '\logoc.png','logo');

                $mail->send();
                echo json_encode($pago);

                exit();
               // http_response_code(200); //deu certo
            }
            else{
               //http_response_code(500); //deu errado
            }
            $stmt1->close();
        }
        else{
            $presenca = 1;
            echo json_encode($presenca);
        }
    }
    
}
else{

    $sql_pago ="SELECT * FROM tb_presencas WHERE id_presenca = ? AND pago = 1";
    $stmt_pago = $link -> prepare($sql_pago);
    $stmt_pago->bind_param("i",$id_presenca);
    $stmt_pago->execute();
    $result_pago = $stmt_pago->get_result();

    if($result_pago->num_rows>0){
        $sql2 = "UPDATE tb_presencas SET pago = 0, cor_botao_pagar = 'danger', texto_pagar = 'Pagar', musico_label_pago = 'Por Pagar',  cor_pago_musico = 'red' WHERE id_presenca = ?";
        $stmt2 = $link -> prepare($sql2);
        $stmt2->bind_param("i",$id_presenca);
        $pago = 0;

        if($stmt2->execute()){
            echo json_encode($pago);
            exit(); 
            //http_response_code(200); //deu certo
        }
        else{
            //http_response_code(500); //deu errado
        }
        $stmt2->close();
    }
}

$stmt_pagar->close();
$stmt_pago->close();
$link->close();
?>
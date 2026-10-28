<?php

require_once "config.php";
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require './phpmailer/src/Exception.php';
require './phpmailer/src/PHPMailer.php';
require './phpmailer/src/SMTP.php';

require_once "config.php";

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Banda de Coimbrões</title>
        <link rel="icon" type="image/x-icon" href="assets/banda.png" />
        <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="https://unpkg.com/bootstrap@5.3.2/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://unpkg.com/bs-brain@2.0.3/components/password-resets/password-reset-5/assets/css/password-reset-5.css">

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        <link href="css/styles.css" rel="stylesheet" /> 
        <style>
          #erropass{
            display: none;
          }
        </style>
    </head>

<body>

<section class="p-3 p-md-4 p-xl-5">
  <div class="container">
    <div class="card border-light-subtle shadow-sm">
      <div class="row g-0">
        <div class="col-12 col-md-6 text-bg-primary bg-dark">
          <div class="d-flex align-items-center justify-content-center h-100">
            <div class="col-10 col-xl-8 py-3 text-center">
              <hr class="border-primary-subtle mb-4">
              <h2 class="h1 mb-4">O melhor site a nível nacional!</h2><br>
              <img class="img-fluid rounded mb-4" loading="lazy" src="./assets/img/logos/logoc.png" width="245" height="80" alt="BootstrapBrain Logo">
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="card-body p-3 p-md-4 p-xl-5">
            <div class="row">
              <div class="col-12">
                <div class="mb-5">
                  <h2 class="h3">Recuperação de Palavra-Passe</h2><br>
                  <h3 class="fs-6 fw-normal text-secondary m-0">Insira o seu email e data de nascimento para recuperar a sua palavra-passe.</h3>
                </div>
              </div>
            </div>
            <form action="<?php echo $_SERVER["PHP_SELF"] ?>" method="post">
              <div class="row gy-3 gy-md-4 overflow-hidden">
                <div class="col-12">
                  <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                  <input type="email" style="color: black; border: 1px solid #ced4da; border-radius: 4px;" class="form-control" name="email" id="email" placeholder="nome@exemplo.com" required>
                </div>
                <div class="col-12">
                  <label for="date" class="form-label">Data de Nascimento <span class="text-danger">*</span></label>
                  <input type="date" style="color: black; border: 1px solid #ced4da; border-radius: 4px;" class="form-control" name="date" id="date" placeholder="aa-mm-dd" required>
                </div>
                <div class="col-12">
                  <div class="d-grid">
                    <input class="btn bsb-btn-xl btn-dark" type="submit" id="enviar" value="Enviar">
                  </div>
                </div>
              </div>
            </form>
            <p></p>
            <div class="row">
              <div class="alert alert-danger" id="erropass" role="alert">
                Email ou data de nascimento inválidos.
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <hr class="mt-2 mb-2 border-secondary-subtle">
                <div class="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end">
                  <a href="./index.php" class="link-secondary text-decoration-none">Voltar</a>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <p class="mt-1 mb-2">Sociedade Musical 1º de Agosto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="ModalFormLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content" style="border: none !important;">
      <div class="modal-body bg-dark">
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        <div class="myform bg-dark">
          <h1 class="" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 40px;">Sucesso</h1>
          <p style="color: light-grey; font-size: 18px;">Email enviado com sucesso! Verifique a sua Caixa de Entrada.</p>
          <a href="./index.php" style="margin-top: 2%;" class="btn btn-light">Ok</a>
        </div>
      </div>
    </div>
  </div>
</div>

<?php

if($_SERVER["REQUEST_METHOD"] == "POST"){
  $email = $_POST["email"];
  $data = $_POST["date"];

  $sql = "SELECT id_utilizador, nome_utilizador, email FROM tb_utilizadores WHERE email = ? AND data_nascimento = ?";

  if($stmt = $link->prepare($sql)){
      $stmt->bind_param("ss",$email, $data);
      $stmt->execute();
      $result = $stmt->get_result();

      if($result->num_rows>0){
          while($row = $result->fetch_assoc()){
            
            // EMAIL
            $id = $row['id_utilizador'];
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
            
            $mail->Subject = 'Recuperar palavra-passe';

            $mail->Body = '<h2 style="color: black;">Olá, '.$row['nome_utilizador'].'!</h2><p><h3 style="color: black;">Parece que precisas de recuperar a tua palavra-passe!</h3> <p>
            <h3 style="color: black;">Aqui está o <a href="http://localhost/pap/projeto/reset_password.php?id='.$id.'&time='.time().'">link</a> para o poderes fazer!</h3><p><br>
            <p><br><h4 style="color: black;">Os melhores cumprimentos,</h4><p><h4 style="color: black;">A direção da Sociedade Musical 1º de Agosto.</h4>
            <p><img style="height: 130px; width: 130px;" src="cid:logo">';

            $mail->addEmbeddedImage(dirname(__FILE__) . '\logoc.png','logo');

            $mail->send();
          
            echo "<script>
                    document.getElementById('email').disabled = true;
                    document.getElementById('date').disabled = true;
                    document.getElementById('enviar').disabled = true;
                  </script>";

            echo "<script>var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
            myModal.show();</script>";

          }
      }
      else{
        echo"
        <script>
            localStorage.setItem('erro_email', 'erro_email');
            setTimeout(function() {
                window.location.href = 'esqueceu_password.php';
            }, 100);
        </script>";
      }
  }
  exit();
}
?>

<script>
  $(document).ready(function(){
    let erro_email = localStorage.getItem("erro_email");
    if(erro_email != null){
        document.getElementById("erropass").style.display = "block";
        localStorage.removeItem("erro_email")
    }
  });
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>    

</body>
</html>
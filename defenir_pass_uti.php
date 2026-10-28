<?php

require_once "config.php";

$sql_check_fields = "SELECT senha FROM tb_utilizadores WHERE id_utilizador = ?";
if($stmt_check_fields = $link->prepare($sql_check_fields)){
  $stmt_check_fields->bind_param("i", $_GET['id']);
  $stmt_check_fields->execute();
  $stmt_check_fields->store_result();
  $stmt_check_fields->bind_result($senha); 
  $stmt_check_fields->fetch();
  
  if(!empty($senha)){
      header("Location: erro_definicao.php");
      exit();
  }
  
  $stmt_check_fields->close();
}
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
          #erro_pass{
            display: none;
          }
          #erro_pass2{
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
                  <h2 class="h3">Definição de Password</h2><br>
                  <h3 class="fs-6 fw-normal text-secondary m-0">Escolha uma Password.</h3>
                </div>
              </div>
            </div>
            <form action="<?php echo $_SERVER["PHP_SELF"] ?>" method="post">
              <div class="row gy-3 gy-md-4 overflow-hidden">
                <div class="col-12">
                  <label for="date" class="form-label">Password <span class="text-danger">*</span></label>
                  <input type="password" style="color: black; border: 1px solid #ced4da; border-radius: 4px;" minlength="8" class="form-control" name="senha" id="senha" required>
                </div>
                <div class="col-12">
                  <label for="date" class="form-label">Confirmar Password <span class="text-danger">*</span></label>
                  <input type="password" style="color: black; border: 1px solid #ced4da; border-radius: 4px;" minlength="8" class="form-control" name="senha2" id="senha2" required>
                </div>
                <div class="col-12">
                  <div class="d-grid">
                    <input type="hidden" name="id" value="<?php echo $_GET["id"];?>">
                    <input class="btn bsb-btn-xl btn-dark" id="enviar" type="submit" value="Enviar">
                  </div>
                </div>
              </div>
            </form>
            <p></p>
            <div class="row">
              <div class="alert alert-danger" id="erro_pass" role="alert">
                Esse utilizador já está em uso! Escolhe outro
              </div>
            </div>
            <div class="row">
              <div class="alert alert-danger" id="erro_pass2" role="alert">
                As passwords não coincidem.
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
          <p style="color: light-grey; font-size: 18px;">A sua Password foi definida com sucesso.</p>
          <a href="./index.php" style="margin-top: 2%;" class="btn btn-light">Ok</a>
        </div>
      </div>
    </div>
  </div>
</div>

<?php

if($_SERVER["REQUEST_METHOD"] == "POST"){

  $stmt = null;
  //$email = $_POST["uti"];
  $senha = $_POST["senha"];
  $confirm = $_POST["senha2"];
  $id = $_POST["id"];

 /* $sql_verify = "SELECT id_utilizador FROM tb_utilizadores WHERE email=?";
  if($stmt_verify = $link->prepare($sql_verify)){
    $stmt_verify->bind_param("s",$utilizador);
    $stmt_verify->execute();
    $stmt_verify->store_result();
    if($stmt_verify->num_rows > 0){
      echo"
      <script>
          localStorage.setItem('erro_pass', 'erro_pass');
          setTimeout(function() {
              window.location.href = 'defenir_pass_uti.php?id=".$id."';
          }, 100);
      </script>";
    }
    else{*/
      if($senha == $confirm){
        $encriptacao_hash = password_hash($senha, PASSWORD_DEFAULT);

        $sql = "UPDATE tb_utilizadores SET senha = ? WHERE id_utilizador = ?";
      
        if($stmt = $link->prepare($sql)){
          $stmt->bind_param("si",$encriptacao_hash,$id);
          $stmt->execute();
          
          echo "<script>
                    document.getElementById('senha').disabled = true;
                    document.getElementById('senha2').disabled = true;
                    document.getElementById('enviar').disabled = true;
                  </script>";

          echo "<script>var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
          myModal.show();</script>";
          
          //session_destroy();
        }
      }
      else{
        echo"
        <script>
            localStorage.setItem('erro_pass2', 'erro_pass');
            setTimeout(function() {
                window.location.href = 'defenir_pass_uti.php?id=".$id."';
            }, 100);
        </script>";
      }
      if ($stmt !== null) {
        $stmt->close();
      }
    /*}
  }*/
  $link->close();
  exit();
}

?>

<script>
  $(document).ready(function(){
    let erro_pass = localStorage.getItem("erro_pass");
    if(erro_pass != null){
        document.getElementById("erro_pass").style.display = "block";
        localStorage.removeItem("erro_pass")
    }

    let erro_pass2 = localStorage.getItem("erro_pass2");
    if(erro_pass2 != null){
        document.getElementById("erro_pass2").style.display = "block";
        localStorage.removeItem("erro_pass2")
    }
  });
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>    

    </body>
</html>
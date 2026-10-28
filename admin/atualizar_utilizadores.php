<?php
    require_once "../config.php";

    if(!isset($_SESSION['log-in'])) {
      header('Location: ../index.php');
      exit();
    }

    $sq="SELECT * FROM tb_instrumentos";
    $resultado=$link->query($sq);

    $sq2="SELECT * FROM tb_genero";
    $resultado2=$link->query($sq2);

    $sq3="SELECT * FROM tb_cargo";
    $resultado3=$link->query($sq3);

    $id_utilizador=$_GET["id"];
    if (isset($id_utilizador) ){
        $sql= "SELECT * FROM tb_utilizadores 
        INNER JOIN tb_instrumentos ON tb_utilizadores.instrumento=tb_instrumentos.id_instrumento
        INNER JOIN tb_genero ON tb_utilizadores.genero_id=tb_genero.id_genero
        INNER JOIN tb_cargo ON tb_utilizadores.cargo_id=tb_cargo.id_cargo
        WHERE id_utilizador= ?";
        if ($stmt = $link->prepare($sql)){
            $stmt->bind_param("i", $_GET["id"]);
            if ($stmt->execute()){
                $result = $stmt->get_result();
                if ($result->num_rows==1){
                    $row=$result->fetch_array(MYSQLI_ASSOC);
                    $nome=$row["nome_utilizador"];
                    $foto=$row["foto_perfil"];
                    $nome_foto=$row["nome_foto"];
                    $telemovel=$row["telemovel"];
                    $cc=$row["numero_cc"];
                    $nif=$row["nif"];
                    $data_nascimento=$row["data_nascimento"];
                    $email=$row["email"];
                    $instrumento=$row["nome_instrumento"];
                    $genero=$row["genero"];
                    $cargo=$row["nome_cargo"];
                }
                else{
                    echo "Ocorreu um erro! Por favor tente novamente1.";
                    exit();
                }
            }
            else{
                echo "Ocorreu um erro! Por favor tente novamente2.";
                exit();
            }
        }
        $stmt->close();
        
    }
    else{
        echo "Ocorreu um erro! Por favor tente novamente3.";
    
        exit();
    }
    $link->close();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar</title>
    <link rel="icon" type="image/x-icon" href="../assets/banda.png" />
    <link rel="stylesheet" href="../css/style_admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.17.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="../js/datatables-simple-demo.js"></script>
    <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">
    <link href="../css/sb-admin-2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/izitoast/dist/js/iziToast.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/izitoast/dist/css/iziToast.min.css">
  </head>
<body>

<?php include("navbar_admin.php")?>

<div class="container-fluid pt-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-body w-100">
            <form action="editarutilizadores.php" method="POST" enctype="multipart/form-data" onsubmit="return validarDataNascimento();">
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Nome</p>
                </div>
                <div class="col-sm-9">
                  <input class="form-control w-100" name="nome" value="<?php echo $row['nome_utilizador']; ?>">
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Foto de Perfil</p>
                </div>
                <div class="col-sm-9">
                  <input type="file" name="foto_perfil" id="foto_perfil" accept=".jpg, .png">
                </div>
              </div>
              <hr>
              <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Telemóvel</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100" pattern="[0-9]{9}" title="Por favor, insira um número de telefone válido com 9 dígitos." name="telemovel" value="<?php echo $row['telemovel']; ?>">
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Nº Cartão de Cidadão</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100" pattern="[0-9]{8}" title="Por favor, insira um número de Cartão de Cidadão válido com 8 dígitos." name="cc" value="<?php echo $row['numero_cc']; ?>">
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Nº Identificação Fiscal</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100" pattern="[0-9]{9}" title="Por favor, insira um número de Identificação Fiscal válido com 9 dígitos." name="nif" value="<?php echo $row['nif']; ?>">
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Data de Nascimento</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100" type="date" name="data" id="data" value="<?php echo $row['data_nascimento']; ?>">
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Email</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100" type="text" name="email" value="<?php echo $row['email']; ?>">
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Instrumento</p>
              </div>
              <div class="col-sm-9">
              <select class="form-select form-control" name="instrumento" style="width: 100%; color:grey;">
              <?php
                    if($resultado -> num_rows >=0){
                    echo $row['instrumento'];
                    echo "<option value=".$row['id_instrumento']." selected >".$instrumento."</option>";
                    while ($row_instrumento=$resultado->fetch_assoc()){
                        if($row_instrumento['id_instrumento'] != $row['instrumento']){
                            echo "<option value=".$row_instrumento['id_instrumento'].">".$row_instrumento['nome_instrumento']."</option>";
                        }
                    }
                    }
                    else{
                        echo "Essa opção não é selecionável.";
                    }
                ?>
              </select>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Género</p>
              </div>
              <div class="col-sm-9">
                <select class="form-select form-control" name ="genero" style="width:100%; color:grey;" required>   
                  <?php
                  if($resultado -> num_rows >=0){
                    echo "<option value=".$row['id_genero']." selected >".$genero."</option>";
                    while ($row_genero=$resultado2->fetch_assoc()){
                        if($row_genero['genero'] != $row['genero']){
                            echo "<option value=".$row_genero['id_genero'].">".$row_genero['genero']."</option>";
                        }
                    }
                    }
                    else{
                    echo "Essa opção não é selecionável.";
                    }            
                  ?>
                  </select>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Cargo</p>
              </div>
              <div class="col-sm-9">
                <select class="form-select form-control" name ="cargo" style="width:100%; color:grey;" required>   
                  <?php
                  if($resultado3 -> num_rows >=0){
                    echo "<option value=".$row['id_cargo']." selected >".$cargo."</option>";
                    while ($row_cargo=$resultado3->fetch_assoc()){
                        if($row_cargo['nome_cargo'] != $row['nome_cargo']){
                            echo "<option value=".$row_cargo['id_cargo'].">".$row_cargo['nome_cargo']."</option>";
                        }
                    }
                    }
                    else{
                    echo "Essa opção não é selecionável.";
                    }           
                  ?>
                  </select>
              </div>
            </div>
            <hr>
                <input type="hidden" value="<?php echo($id_utilizador)?>" name="id_utilizador">
                <?php 
              echo "<input type='submit' href='editarutilizadores.php?id=".$row['id_utilizador']."'class='btn btn-secondary btabela mt-5 position-relative bottom-0 start-50 translate-middle w-100' value='Salvar'>";
              echo "<a href='utilizadores.php' class='btn btn-secondary btabela mt-2 position-relative bottom-0 start-50 translate-middle w-100'>Cancelar</a>"
              ?>
            </form>
          </div>
        </div>
      </div>
    </div>
</div>


<script>
    function validarDataNascimento() {
        var dataNascimento = document.getElementById("data").value;
        var dataAtual = new Date().toISOString().slice(0, 10);
        
        if (dataNascimento >= dataAtual) {
            iziToast.error({
                title: 'Erro',
                message: 'Por favor, insira uma data de nascimento válida.',
                position: 'topRight'
            });
            return false;
        }
        return true; 
    }
</script>

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<script src="../js/datatables-simple-demo.js"></script>

<script src="../vendor/jquery/jquery.min.js"></script>
<script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="../js/sb-admin-2.min.js"></script>
<script src="../vendor/chart.js/Chart.min.js"></script>
</body>
</html>
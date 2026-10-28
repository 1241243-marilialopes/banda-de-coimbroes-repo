<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$sq="SELECT * FROM tb_instrumentos";
$resultado=$link->query($sq);

$sq2="SELECT * FROM tb_genero";
$resultado2=$link->query($sq2);

$id=$_SESSION["id"];
    if (isset($id) ){
        $sql= "SELECT * FROM tb_utilizadores 
        INNER JOIN tb_instrumentos ON tb_utilizadores.instrumento=tb_instrumentos.id_instrumento
        INNER JOIN tb_genero ON tb_utilizadores.genero_id=tb_genero.id_genero
        WHERE id_utilizador=".$id;
        if ($stmt = $link->prepare($sql)){
            if ($stmt->execute()){
                $result = $stmt->get_result();
                if ($result->num_rows==1){
                    $row=$result->fetch_array(MYSQLI_ASSOC);
                    $nome=$row["nome_utilizador"];
                    $foto = $row["foto_perfil"];
                    $cc=$row["numero_cc"];
                    $nif=$row["nif"];
                    $telemovel=$row["telemovel"];
                    $data=$row["data_nascimento"];
                    $email = $row['email'];
                    $genero = $row['genero'];
                    
                    $instrumento=$row["nome_instrumento"];
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
        $link->close();
    }
    else{
        echo "Ocorreu um erro! Por favor tente novamente3.";
    
        exit();
    }

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conta</title>
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
    <style>
        body{
            margin-top:0px;
            background-color:white;
            color:black;
        }
        .img-account-profile {
            height: 160px;
            width: 180px;
        }
        .rounded-circle {
            border-radius: 50% !important;
        }
        .card {
            box-shadow: 0 0.15rem 1.75rem 0 rgb(33 40 50 / 15%);
        }
        .card .card-header {
            font-weight: 500;
        }
        .card-header:first-child {
            border-radius: 0.35rem 0.35rem 0 0;
        }
        .card-header {
            padding: 1rem 1.35rem;
            margin-bottom: 0;
            background-color: rgba(33, 40, 50, 0.03);
            border-bottom: 1px solid rgba(33, 40, 50, 0.125);
        }
        .form-control, .dataTable-input {
            display: block;
            width: 100%;
            padding: 0.875rem 1.125rem;
            font-size: 0.875rem;
            font-weight: 400;
            line-height: 1;
            color: #69707a;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #c5ccd6;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border-radius: 0.35rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .nav-borders .nav-link.active {
            color: #0061f2;
            border-bottom-color: #0061f2;
        }
        .nav-borders .nav-link {
            color: #69707a;
            border-bottom-width: 0.125rem;
            border-bottom-style: solid;
            border-bottom-color: transparent;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            padding-left: 0;
            padding-right: 0;
            margin-left: 1rem;
            margin-right: 1rem;
        }
    </style>
  </head>
<body>
<?php include("navbar_musicos.php")?>

<div class="container-xl px-4 mt-4">

    <hr class="mt-0 mb-4">
    <div class="row">
        <div class="col-xl-4">
            <div class="card mb-4">
                <div class="card-header">Foto de perfil</div>
                <form id="fotoPerfil" method="post" enctype="multipart/form-data" action="editarfotomusico.php">
                    <div class="card-body text-center">
                        <?php
                            if(!empty($foto)):?> 
                                <img id='imagem' class='img-account-profile rounded-circle mb-2' src='data:image/jpeg;base64,<?=base64_encode($foto)?>' alt='Foto de perfil'>
                            <?php endif;?>          
                        <br><br>
                        <button class="btn btn-outline-warning" id="foto" type="button"><i class='fas fa-pen'></i></button>
                        <input type="file" id="fileInput" name="imagem" style="display: none;">
                        <button class="btn btn-outline-success" type="submit" name="submit" ><i class='fas fa-save'></i></button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="col-xl-8">
            <div class="card mb-4">
                <div class="card-header">Detalhes</div>
                <div class="card-body">
                    <form action="editarcontamusico.php" method="post" onsubmit="return validarDataNascimento()">
                        <div class="mb-3">
                            <label class="small mb-1" for="inputFirstName">Nome</label>
                            <input class="form-control" id="nome" name="nome" type="text" value="<?= $nome?>">
                         </div>
                        <div class="mb-3">
                            <label class="small mb-1" for="inputEmailAddress">Email</label>
                            <input class="form-control" id="email" name="email" type="email" value="<?= $email?>" disabled>
                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputPhone">Nº Cartão Cidadão</label>
                                <input class="form-control" id="cc" name="text" pattern="[0-9]{8}" title="Por favor, insira um número de Cartão de Cidadão válido com 8 dígitos." type="text" value="<?= $cc?>" disabled>
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputBirthday">NIF</label>
                                <input class="form-control" id="nif" name="nif" type="text" pattern="[0-9]{9}" title="Por favor, insira um número de Identificação Fiscal válido com 9 dígitos." value="<?= $nif?>" disabled>
                            </div>
                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputPhone">Telemóvel</label>
                                <input class="form-control" id="tele" name="tele" type="text" pattern="[0-9]{9}" title="Por favor, insira um número de telefone válido com 9 dígitos." value="<?= $telemovel?>">
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputBirthday">Data da nascimento</label>
                                <input class="form-control" id="data" name="data" type="date" value="<?= $data?>">
                            </div>
                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputEmailAddress">Instrumento</label>
                                <select id="instrumento" name="instrumento" class="custom-select" disabled>
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
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputBirthday">Género</label>
                                <select id="genero" name="genero" class="custom-select">
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
                        <button class="btn btn-outline-success" style="float: right;" type="submit" name="submit"><i class='fas fa-save'></i></button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<script>

    var sucesso = localStorage.getItem('sucesso');
    if (sucesso) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Perfil atualizado com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso');
    }

    var erro = localStorage.getItem('erro');
    if (erro) {
        iziToast.error({
            title: 'Erro',
            message: 'Ocorreu um erro.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('erro');
    }

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

    document.getElementById('foto').addEventListener('click', function(){
        document.getElementById('fileInput').click();
    })

    document.getElementById('fileInput').addEventListener('change', function(){
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function(e){
            document.getElementById('imagem').src = e.target.result;
        }
        reader.readAsDataURL(file);
    })
</script>

<script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<script src="../vendor/jquery/jquery.min.js"></script>
<script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../vendor/jquery-easing/jquery.easing.min.js"></script>
<script src="../js/sb-admin-2.min.js"></script>
<script src="../vendor/chart.js/Chart.min.js"></script>
</body>
</html>
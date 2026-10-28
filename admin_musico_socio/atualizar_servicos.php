<?php
    require_once "../config.php";

    if(!isset($_SESSION['log-in'])) {
      header('Location: ../index.php');
      exit();
    }

    $sq="SELECT * FROM tb_tipos_servicos";
    $resultado=$link->query($sq);
    
    $id_servico=$_GET["id"];
    if (isset($id_servico) ){
        $sql="select * FROM tb_servicos
          INNER JOIN tb_tipos_servicos ON tb_servicos.tipo=tb_tipos_servicos.id_tipo
          WHERE id_servico = ?";
        if ($stmt = $link->prepare($sql)){
            $stmt->bind_param("i", $_GET["id"]);
            if ($stmt->execute()){
                $result = $stmt->get_result();
                if ($result->num_rows==1){
                    $row=$result->fetch_array(MYSQLI_ASSOC);
                    $nome=$row["nome_servico"];
                    $descricao=$row["descricao_servico"];
                    $tipo=$row["tipo_servico"];
                    $data_inicio=$row["data_inicial"];
                    $data_final=$row["data_final"];  
                    $local=$row["localizacao"]; 
                    $tele=$row["contacto_comissao"];
                    $nome_com=$row["nome_comissao"];
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
    <title>Editar</title>
    <link rel="icon" type="image/x-icon" href="../assets/banda.png" />
    <link rel="stylesheet" href="../css/style_admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.17.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
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
            <form action="editarservicos.php" method="POST" id="editarServicoForm" onsubmit="return validarForm()">
          <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Serviço</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100" name="nome" value="<?php echo $row['nome_servico']; ?>">
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Descrição</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100" name="descricao" value="<?php echo $row['descricao_servico']; ?>">
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Tipo de serviço</p>
              </div>
              <div class="col-sm-9">
                <select class="form-select form-control" name="tipo" style="width: 100%; color: grey;">
                  <?php
                        if($resultado -> num_rows >=0){
                        echo $row['tipo_servico'];
                        echo "<option value=".$row['id_tipo']." selected >".$tipo."</option>";
                        while ($row_tipo=$resultado->fetch_assoc()){
                            if($row_tipo['id_tipo'] != $row['tipo']){
                                echo "<option value=".$row_tipo['id_tipo'].">".$row_tipo['tipo_servico']."</option>";
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
                <p class="mb-0">Data inicial</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100" name="data_inicial" value="<?php echo $row['data_inicial']; ?>">
              </div>
            </div>  
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Data final</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100" name="data_final" value="<?php echo $row['data_final']; ?>">
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Localização</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100" name="local" value="<?php echo $row['localizacao']; ?>">
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Contacto da comissão</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100"  pattern="[0-9]{9}" name="tele" value="<?php echo $row['contacto_comissao']; ?>">
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Nome do responsável</p>
              </div>
              <div class="col-sm-9">
                <input class="form-control w-100" name="nome_resp" value="<?php echo $row['nome_comissao']; ?>">
              </div>
            </div>
            <hr>
            
            
                <input type="hidden" value="<?php echo($id_servico)?>" name="id_servico">



                <?php 
              echo "<input type='submit' href='gerir_servicos.php?id=".$row['id_servico']."'class='btn btn-secondary btabela mt-5 position-relative bottom-0 start-50 translate-middle w-100' value='Salvar'>";
              echo "<a href='gerir_servicos.php' class='btn btn-secondary btabela mt-2 position-relative bottom-0 start-50 translate-middle w-100'>Cancelar</a>"
              
              ?>
            </form>
          </div>
        </div>
                </main>
            </div>
        </div>


<script>

function validarForm() {
      var dataInicial = new Date($('[name="data_inicial"]').val());
      var dataFinal = new Date($('[name="data_final"]').val());

      if (dataFinal < dataInicial) {
          iziToast.error({
              title: 'Erro',
              message: 'A data final não pode ser anterior à data inicial.',
              position: 'topRight',
              timeout: 5000
          });
          return false; 
      }

      var dataAtual = new Date();
      if (dataInicial < dataAtual) {
          iziToast.error({
              title: 'Erro',
              message: 'A data inicial não pode ser uma data passada.',
              position: 'topRight',
              timeout: 5000
          });
          return false;
      }

      if (dataInicial.getTime() === dataFinal.getTime()) {
          iziToast.error({
              title: 'Erro',
              message: 'A data inicial não pode ser igual à data final.',
              position: 'topRight',
              timeout: 5000
          });
          return false;
      }

      return true;
  }

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
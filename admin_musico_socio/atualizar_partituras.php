<?php
    require_once "../config.php";

    if(!isset($_SESSION['log-in'])) {
      header('Location: ../index.php');
      exit();
    }
    
    $sq="SELECT * FROM tb_instrumentos";
    $resultado=$link->query($sq);
    
    $sql_partituras="SELECT * FROM tb_nome_partituras";
    $resultado_partituras=$link->query($sql_partituras);

    $id_partitura=$_GET["id"];
    $selected=$_GET["op"];
    if (isset($id_partitura) ){
        $sql= "SELECT * FROM tb_partituras 
        INNER JOIN tb_instrumentos ON tb_partituras.instrumento=tb_instrumentos.id_instrumento
        INNER JOIN tb_nome_partituras ON tb_partituras.nome=tb_nome_partituras.id_nome_partitura
        WHERE id_partitura= ?";
        if ($stmt = $link->prepare($sql)){
            $stmt->bind_param("i", $_GET["id"]);
            if ($stmt->execute()){
                $result = $stmt->get_result();
                if ($result->num_rows==1){
                    $row=$result->fetch_array(MYSQLI_ASSOC);
                    $nome=$row["nome_partitura"];
                    $instrumento=$row["nome_instrumento"];
                    $imagem=$row["imagem_partitura"];
                    $ficheiro=$row["ficheiro_partitura"];
                    $nome_imagem=$row["nome_imagem"];
                    $nome_ficheiro=$row["nome_ficheiro"];
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
        echo "Ocorreu um erro! Por favor tente novamente.";
    
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
    <script src="../js/datatables-simple-demo.js"></script>
    <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">
    <link href="../css/sb-admin-2.min.css" rel="stylesheet">
  </head>
<body>

<?php include("navbar_admin.php")?>

<div class="container1">

<div class="row justify-content-center">
      
      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-body w-100">
          <div class="card-body w-100">
            <form action="editarpartituras.php" method="POST" enctype="multipart/form-data">
          <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Nome da partitura</p>
              </div>
              <div class="col-sm-9">
              <select class="form-select form-control" name="partitura" style="width: 100%;">
                <?php
                  if($resultado_partituras -> num_rows >=0){
                    echo $row['nome'];
                    echo "<option value=".$row['id_nome_partitura']." selected >".$nome."</option>";
                    while ($row_partitura=$resultado_partituras->fetch_assoc()){
                        if($row_partitura['id_nome_partitura'] != $row['nome']){
                            echo "<option value=".$row_partitura['id_nome_partitura'].">".$row_partitura['nome_partitura']."</option>";
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
                <p class="mb-0">Instrumento</p>
              </div>
              <div class="col-sm-9">
              <select class="form-select form-control" name="instrumento" style="width: 100%;">
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
                <p class="mb-0">Imagem</p>
              </div>
              <div class="col-sm-9">
                <input type="file" name="imagem" id="imagem" accept="image/*">
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Ficheiro</p>
              </div>
              <div class="col-sm-9">
                <input type="file" name="pdf" accept=".pdf" id="pdf">
              </div>
            </div>
            <hr>
                <input type="hidden" value="<?php echo($id_partitura)?>" name="id_partitura">

                <?php 
              echo "<input type='submit' href='editarpartituras.php?id=".$row['id_partitura']."&op=".$selected."'class='btn btn-secondary btabela mt-5 position-relative bottom-0 start-50 translate-middle w-100' value='Salvar'>";
              echo "<a href='caderneta.php?op=".$selected."' class='btn btn-secondary btabela mt-2 position-relative bottom-0 start-50 translate-middle w-100'>Cancelar</a>"
              
              ?>
            </form>
          </div>
        </div>
        </main>
    </div>
</div>

<script>
  
    /*const fileInput1 = document.querySelector('#imagem');
    const imageName = '<?php echo $nome_imagem?>';

    if(imageName != ''){
      const myFile1 = new File([], imageName, {
        type: 'text/plain',
        lastModified: new Date().getTime(),
      });
      const dataTransfer1 = new DataTransfer();
      dataTransfer1.items.add(myFile1);
      fileInput1.files = dataTransfer1.files;
    }
   
    const fileInput2 = document.querySelector('#pdf');
    const pdfName = '<?php echo $nome_ficheiro?>';

    if(pdfName != ''){
      const myFile2 = new File([], pdfName, {
        type: 'application/pdf',
        lastModified: new Date().getTime(),
      });
      const dataTransfer2 = new DataTransfer();
      dataTransfer2.items.add(myFile2);
      fileInput2.files = dataTransfer2.files;
    }*/
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
<?php
require_once('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$email = $_SESSION['email'];
$sq1="SELECT * FROM tb_utilizadores WHERE email = '".$email."'";
$result_nome = $link->query($sq1);
if($result_nome->num_rows>0){
  while($sub_row2 = $result_nome ->fetch_assoc()){
      $id_musico = $sub_row2['id_utilizador'];
  }
}


$sq="SELECT * FROM tb_servicos
INNER JOIN tb_tipos_servicos ON tb_servicos.tipo=tb_tipos_servicos.id_tipo
WHERE data_inicial < CURDATE()";
$results = $link->query($sq);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presenças</title>
    <link rel="icon" type="image/x-icon" href="../assets/banda.png" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.17.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    
    <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">
    <link href="../css/sb-admin-2.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js"></script>
    <style>
      .container1{
        width: 95%;
        margin-top: 4% !important;
        margin: auto;
      }
    </style>
</head>
<body>
<?php include("navbar_admin.php")?>
<div class="container1">
<h2>Histórico de Presenças </h2>
    <br>
    <div class="form-group">
      <label for="numLinhas">Linhas a mostrar:</label>
      <select class="form-control" id="numLinhas" onchange="changeNumLinhas()">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
    </div>
    <div class="form-group">
      <input type="text" class="form-control" id="pesquisa" onkeyup="filtrarTabela()" placeholder="Pesquisar...">
    </div>
    <div class="table-responsive">
    <table class="table" id="tabela">
      <thead>
        <tr>
          <th>Serviço</th>
          <th>Descrição</th>
          <th>Data inícial</th>
          <th>Data final</th>
          <th>Localização</th>
          <th>Presença</th>
          <th>Pago</th>
        </tr>
      </thead>
      <tbody>
      <?php
        
            if ($results->num_rows>0){
                while ($row = $results->fetch_assoc()){
                  if($row['tipo'] != 4){
                    echo "<tr>";
                    echo "<td>".$row['nome_servico']."</td>";
                    echo "<td>".$row['descricao_servico']."</td>";
                    echo "<td>".$row['data_inicial']."</td>";
                    echo "<td>".$row['data_final']."</td>";
                    echo "<td>".$row['localizacao']."</td>";


                    $sql2 = "SELECT * FROM tb_presencas WHERE servico_id = ".$row['id_servico']." AND musico_id = ".$id_musico."";

                    $result_servico = $link->query($sql2);
                    if($result_servico->num_rows>0){
                      while($sub_row3 = $result_servico ->fetch_assoc()){
                        $cor_confirm = $sub_row3['cor_botao_confirma_musico'];
                        $presenca_id = $sub_row3['id_presenca'];
                        $confirm = $sub_row3['confirmado'];
                        $musico_pago = $sub_row3['musico_label_pago'];
                        $pago_cor = $sub_row3['cor_pago_musico'];
                      }
                          
                    }
                                                  
                      echo "<td>";
                      
                      echo "<button href='marcar_presenca.php?id=".$row['id_servico']."'class='btn btn-".$cor_confirm."' id='btnpresenca".$presenca_id."' onclick='presenca(".$presenca_id.")'>".$confirm."</button";

                      echo "</td>";
                      echo "<td style='color:".$pago_cor."'>".$musico_pago."</td>";
                      echo "</tr>";
                    }
                }
                $results->free();
            }
            $link->close();
            ?>               
      </tbody>
    </table>
  </div>
</div>
          </div>

  <script>

    function changeNumLinhas() {
      var numLinhas = document.getElementById("numLinhas").value;
      var tabela = document.getElementById("tabela");
      var linhas = tabela.getElementsByTagName("tr");

      for (var i = 1; i < linhas.length; i++) {
        if (i <= numLinhas) {
          linhas[i].style.display = "";
        } else {
          linhas[i].style.display = "none";
        }
      }
    }

    function filtrarTabela() {
      var input, filter, tabela, linhas, coluna, texto;
      input = document.getElementById("pesquisa");
      filter = input.value.toUpperCase();
      tabela = document.getElementById("tabela");
      linhas = tabela.getElementsByTagName("tr");

      for (var i = 1; i < linhas.length; i++) {
        coluna = linhas[i].getElementsByTagName("td")[0]; // Índice da coluna que você deseja pesquisar
        if (coluna) {
          texto = coluna.textContent || coluna.innerText;
          if (texto.toUpperCase().indexOf(filter) > -1) {
            linhas[i].style.display = "";
          } else {
            linhas[i].style.display = "none";
          }
        }
      }
    }

    function presenca(idPresenca){
        fetch('marcar_presenca.php?id=' + idPresenca,{
            method: 'POST'
        })
        .then(response => {
            if(response.ok){
              return response.json();
            }
            else{
                throw new Error('Erro na solicitação');
            }
        })
        .then(data => {
          if (data.message !== undefined) {
            console.log(data.message);
            if(data.message === '1'){
              iziToast.warning({
                  title: 'Alerta',
                  message: 'Este serviço já passou. Não pode marcar presença',
                  position: 'topRight',
                  timeout: 5000 
              });
            }
            else if(data.message === '2'){
              iziToast.warning({
                title: 'Alerta',
                message: 'Este serviço já passou. Não pode desmarcar presença',
                position: 'topRight',
                timeout: 5000 
              });
            }
          }
          var marcar = data;
        
          var btnMarcar = document.getElementById('btnpresenca'+ idPresenca);
          if( marcar == 1){
            btnMarcar.classList.remove('btn-warning');
            btnMarcar.classList.add('btn-success');
            btnMarcar.textContent = 'Confirmada';
            iziToast.success({
              title: 'Sucesso',
              message: 'Presença marcada com sucesso!',
              position: 'topRight'
            });
          }
          else if( marcar == 0){
            btnMarcar.classList.remove('btn-success');
            btnMarcar.classList.add('btn-warning');
            btnMarcar.textContent = 'Não confirmada';
            iziToast.success({
              title: 'Sucesso',
              message: 'Presença desmarcada com sucesso!',
              position: 'topRight'
            });
          }
        })
        .catch(error =>{
            console.error('Ocorreu um erro: ', error);
          })
    }
  </script>

</main>

</div>
</div>


<script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>


    <script src="../vendor/jquery/jquery.min.js"></script>
    <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="../vendor/jquery-easing/jquery.easing.min.js"></script>
    <script src="../js/sb-admin-2.min.js"></script>
    <script src="../vendor/chart.js/Chart.min.js"></script>
</body>
</html>
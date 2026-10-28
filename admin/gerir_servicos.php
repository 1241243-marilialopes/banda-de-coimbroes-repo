<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.php');
  exit();
}

$sq="SELECT * FROM tb_servicos
INNER JOIN tb_tipos_servicos ON tb_servicos.tipo=tb_tipos_servicos.id_tipo
WHERE data_inicial >= CURDATE() 
ORDER BY data_inicial";
$results = $link->query($sq);

$sql="SELECT * FROM tb_servicos
INNER JOIN tb_tipos_servicos ON tb_servicos.tipo=tb_tipos_servicos.id_tipo
WHERE data_inicial < CURDATE() 
ORDER BY data_inicial";
$result = $link->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar</title>
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
<h2>Editar Serviços <a style='float:right' href='adicionar_servicos.php'class='btn btn-md btn-outline-success btabela'><i class="fas fa-plus"></i></a></h2>
<h4 style="margin-top: 2%;">Eventos futuros</h4>    
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
          <th>Tipo</th>
          <th>Descrição</th>
          <th>Data inícial</th>
          <th>Data final</th>
          <th>Localização</th>
          <th>Contacto</th>
          <th>Nome Responsável</th>
          <th>Opções</th>
        </tr>
      </thead>
      <tbody>
      <?php

            if ($results->num_rows>0){
                while ($row = $results->fetch_assoc()){
                    echo "<tr>";
                    echo "<td>".$row['nome_servico']."</td>";
                    echo "<td>".$row['tipo_servico']."</td>";
                    echo "<td><button type='button' class='btn btn-info btn-md' data-toggle='modal' data-target='#modalDescricao".$row['id_servico']."'>Ver descrição</button></button></td>";
                    echo "<td>".$row['data_inicial']."</td>";
                    echo "<td>".$row['data_final']."</td>";
                    echo "<td>".$row['localizacao']."</td>";
                    echo "<td>".$row['contacto_comissao']."</td>";
                    echo "<td>".$row['nome_comissao']."</td>";
                                                
                    echo "<td>";
                                                

                    
                    echo "<a href='atualizar_servicos.php?id=".$row['id_servico']."'class='btn btn-md btn-outline-warning btabela''><i class='fas fa-pen'></i></a>";
                    echo "  ";
                    echo "<a href='#' class='btn btn-md btn-outline-danger' onclick='confirmarEliminacao(".$row['id_servico'].")'><i class='fas fa-trash'></i></a>";
                                           
                    echo "</td>";
                    echo "</tr>";
                    echo "<div class='modal fade' id='modalDescricao".$row['id_servico']."' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>";
                    echo "<div class='modal-dialog' role='document'>";
                    echo "<div class='modal-content'>";
                    echo "<div class='modal-header'>";
                    echo "<h5 class='modal-title' id='exampleModalLabel'>Descrição do Serviço</h5>";
                    echo "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>";
                    echo "<span aria-hidden='true'>&times;</span>";
                    echo "</button>";
                    echo "</div>";
                    echo "<div class='modal-body'>";
                    echo $row['descricao_servico'];
                    echo "</div>";
                    echo "<div class='modal-footer'>";
                    echo "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Fechar</button>";
                    echo "</div>";
                    echo "</div>";
                    echo "</div>";
                    echo "</div>";
                }
                //$results->free();
            }
            ?>               
      </tbody>
    </table>
  </div>
  <?php echo "<hr>";?>
  <h4 style="margin-top: 2%;">Histórico de Eventos</h4>    
<br>
    <div class="form-group">
      <label for="numLinhas">Linhas a mostrar:</label>
      <select class="form-control" id="numLinhas2" onchange="changeNumLinhas1()">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
    </div>
    <div class="form-group">
      <input type="text" class="form-control" id="pesquisa2" onkeyup="filtrarTabela1()" placeholder="Pesquisar...">
    </div>
    <div class="table-responsive">
    <table class="table" id="tabela1">
      <thead>
        <tr>
          <th>Serviço</th>
          <th>Tipo</th>
          <th>Descrição</th>
          <th>Data inícial</th>
          <th>Data final</th>
          <th>Localização</th>
          <th>Contacto</th>
          <th>Nome Responsável</th>
          <th>Opções</th>
        </tr>
      </thead>
      <tbody>
      <?php

            if ($result->num_rows>0){
                while ($row1 = $result->fetch_assoc()){
                    echo "<tr>";
                    echo "<td>".$row1['nome_servico']."</td>";
                    echo "<td>".$row1['tipo_servico']."</td>";
                    echo "<td><button type='button' class='btn btn-info btn-md' data-toggle='modal' data-target='#modalDescricao".$row1['id_servico']."'>Ver descrição</button></button></td>";
                    echo "<td>".$row1['data_inicial']."</td>";
                    echo "<td>".$row1['data_final']."</td>";
                    echo "<td>".$row1['localizacao']."</td>";
                    echo "<td>".$row1['contacto_comissao']."</td>";
                    echo "<td>".$row1['nome_comissao']."</td>";
                                                
                    echo "<td>";
                                                

                    
                    echo "<a href='atualizar_servicos.php?id=".$row1['id_servico']."'class='btn btn-md btn-outline-warning btabela''><i class='fas fa-pen'></i></a>";
                    echo "  ";
                    echo "<a href='#' class='btn btn-md btn-outline-danger' onclick='confirmarEliminacao(".$row1['id_servico'].")'><i class='fas fa-trash'></i></a>";
                                           
                    echo "</td>";
                    echo "</tr>";
                    echo "<div class='modal fade' id='modalDescricao".$row1['id_servico']."' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>";
                    echo "<div class='modal-dialog' role='document'>";
                    echo "<div class='modal-content'>";
                    echo "<div class='modal-header'>";
                    echo "<h5 class='modal-title' id='exampleModalLabel'>Descrição do Serviço</h5>";
                    echo "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>";
                    echo "<span aria-hidden='true'>&times;</span>";
                    echo "</button>";
                    echo "</div>";
                    echo "<div class='modal-body'>";
                    echo $row1['descricao_servico'];
                    echo "</div>";
                    echo "<div class='modal-footer'>";
                    echo "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Fechar</button>";
                    echo "</div>";
                    echo "</div>";
                    echo "</div>";
                    echo "</div>";
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
</div>

  <script>

    var sucesso = localStorage.getItem('sucesso');
    if (sucesso) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Serviço atualizado com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso');
    }

    var sucesso1 = localStorage.getItem('sucesso1');
    if (sucesso1) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Serviço adicionado com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso1');
    }

    var sucesso2 = localStorage.getItem('sucesso2');
    if (sucesso2) {
        iziToast.success({
            title: 'Sucesso',
            message: 'Serviço eliminado com sucesso.',
            position: 'topRight',
            timeout: 5000 
        });
        localStorage.removeItem('sucesso2');
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

    function confirmarEliminacao(id) {

      iziToast.question({
        timeout: false,
        close: false,
        overlay: true,
        displayMode: 'once',
        id: 'question',
        zindex: 999,
        title: 'Eliminar',
        message: 'Tem certeza que deseja eliminar este evento?',
        position: 'topCenter',
        buttons: [
          ['<button><b>Sim</b></button>', function (instance, toast) {
            window.location.href = 'eliminar_servicos.php?id=' + id;
            instance.hide({ transitionOut: 'fadeOut' }, toast);
          }, true],
          ['<button>Não</button>', function (instance, toast) {
            instance.hide({ transitionOut: 'fadeOut' }, toast);
          }]
        ]
      });
    }
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
        var input, tabela, filtro, coluna, linhas, textoFiltro;
        input = document.getElementById("pesquisa");
        filtro = input.value.toUpperCase();
        tabela = document.getElementById("tabela");
        linhas = tabela.getElementsByTagName("tr");

        for (var i = 0; i < linhas.length; i++) {
            coluna = linhas[i].getElementsByTagName("td")[0];
            if (coluna) {
                textoFiltro = coluna.textContent || coluna.innerText;
                if (textoFiltro.toUpperCase().indexOf(filtro) > -1) {
                    linhas[i].style.display = "";
                } else {
                    linhas[i].style.display = "none";
                }
            }
        }
    }

    function filtrarTabela1() {
        var input, tabela, filtro, coluna, linhas, textoFiltro;
        input = document.getElementById("pesquisa2");
        filtro = input.value.toUpperCase();
        tabela = document.getElementById("tabela1");
        linhas = tabela.getElementsByTagName("tr");

        for (var i = 0; i < linhas.length; i++) {
            coluna = linhas[i].getElementsByTagName("td")[0];
            if (coluna) {
                textoFiltro = coluna.textContent || coluna.innerText;
                if (textoFiltro.toUpperCase().indexOf(filtro) > -1) {
                    linhas[i].style.display = "";
                } else {
                    linhas[i].style.display = "none";
                }
            }
        }
    }

    function changeNumLinhas1() {
      var numLinhas = document.getElementById("numLinhas2").value;
      var tabela = document.getElementById("tabela1");
      var linhas = tabela.getElementsByTagName("tr");

      for (var i = 1; i < linhas.length; i++) {
        if (i <= numLinhas) {
          linhas[i].style.display = "";
        } else {
          linhas[i].style.display = "none";
        }
      }
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
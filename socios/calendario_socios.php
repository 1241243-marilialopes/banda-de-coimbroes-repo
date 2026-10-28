<?php
include('../config.php');

if(!isset($_SESSION['log-in'])) {
  header('Location: ../index.html');
  exit();
}
?>
<!DOCTYPE html>
<html lang="pt-pt">
	<head>
		<meta charset='utf-8' />
      <title>Calendário</title>
      <link rel="icon" type="image/x-icon" href="../assets/banda.png" />
      <link rel="stylesheet" href="../css/style_admin.css">
			<link href="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/style.min.css" rel="stylesheet" />
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.4/font/bootstrap-icons.css">
			<script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>


            <script src='../js/core/main.min.js'></script>
            <script src='../js/interaction/main.min.js'></script>
            <script src='../js/daygrid/main.min.js'></script>
            <script src='../js/core/locales/pt-br.js'></script>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
            <script src="../js/personalizado.js"></script>

    
        <link href='../css/core/main.min.css' rel='stylesheet' />
        <link href='../css/daygrid/main.min.css' rel='stylesheet' />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <!-- <link rel="stylesheet" href="css/personalizado.css">   -->

        <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
            rel="stylesheet">
        <link href="../css/sb-admin-2.min.css" rel="stylesheet">
	</head>
    <body>
        
    <?php include("navbar_socios.php")?>

            <div id="main">
                <div id='calendar'></div>
                
                <div class="modal fade" id="visualizar" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Detalhes do Serviço</h5>
                        <button type="button" class="fas fa-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <dl class="row">
                            <dt class="col-sm-3" id="desc">Descrição e localização</dt>
                            <dd class="col-sm-9" id="title"></dd>
                            
                            <dt class="col-sm-3" id="desc">Início do evento</dt>
                            <dd class="col-sm-9" id="start"></dd>
                            
                            <dt class="col-sm-3" id="desc">Fim do evento</dt>
                            <dd class="col-sm-9" id="end"></dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </div>              
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
        <script src="../js/scripts.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
        <script src="../assets/demo/chart-area-demo.js"></script>
        <script src="../assets/demo/chart-bar-demo.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>
        <script src="../js/datatables-simple-demo.js"></script>
        
        <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="../vendor/jquery-easing/jquery.easing.min.js"></script>
        <script src="../js/sb-admin-2.min.js"></script>
        <script src="../vendor/chart.js/Chart.min.js"></script>
	</body>
</html>

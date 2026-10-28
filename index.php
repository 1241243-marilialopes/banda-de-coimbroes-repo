<?php
require_once "./config.php"; 

//textos
$sql_quemsomos = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'quem_somos'";
$resultado_quemsomos=$link->query($sql_quemsomos);

$sql_escola = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'escola'";
$resultado_escola=$link->query($sql_escola);

$sql_port1_texto = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'port1_texto'";
$resultado_port1_texto=$link->query($sql_port1_texto);

$sql_port2_texto = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'port2_texto'";
$resultado_port2_texto=$link->query($sql_port2_texto);

$sql_port3_texto = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'port3_texto'";
$resultado_port3_texto=$link->query($sql_port3_texto);

$sql_morada = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'morada'";
$resultado_morada=$link->query($sql_morada);

$sql_telefone = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'telefone'";
$resultado_telefone=$link->query($sql_telefone);

$sql_email = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'email'";
$resultado_email=$link->query($sql_email);

$sql_facebook = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'facebook'";
$resultado_facebook=$link->query($sql_facebook);

$sql_instagram = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'instagram'";
$resultado_instagram=$link->query($sql_instagram);

$sql_youtube = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'youtube'";
$resultado_youtube=$link->query($sql_youtube);

$sql_modal1_title = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal1_title'";
$resultado_modal1_title=$link->query($sql_modal1_title);

$sql_modal2_title = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal2_title'";
$resultado_modal2_title=$link->query($sql_modal2_title);

$sql_modal3_title = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal3_title'";
$resultado_modal3_title=$link->query($sql_modal3_title);

$sql_modal1_name = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal1_name'";
$resultado_modal1_name=$link->query($sql_modal1_name);

$sql_modal2_name = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal2_name'";
$resultado_modal2_name=$link->query($sql_modal2_name);

$sql_modal3_name = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal3_name'";
$resultado_modal3_name=$link->query($sql_modal3_name);

$sql_modal1_title_2 = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal1_title'";
$resultado_modal1_title_2=$link->query($sql_modal1_title_2);

$sql_modal2_title_2 = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal2_title'";
$resultado_modal2_title_2=$link->query($sql_modal2_title_2);

$sql_modal3_title_2 = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal3_title'";
$resultado_modal3_title_2=$link->query($sql_modal3_title_2);

$sql_modal1_descricao = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal1_descricao'";
$resultado_modal1_descricao=$link->query($sql_modal1_descricao);

$sql_modal2_descricao = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal2_descricao'";
$resultado_modal2_descricao=$link->query($sql_modal2_descricao);

$sql_modal3_descricao = "SELECT * FROM tb_backoffice WHERE nome_elemento = 'modal3_descricao'";
$resultado_modal3_descricao=$link->query($sql_modal3_descricao);

//imagens

$sql_foto_quem_somos = "SELECT * FROM tb_backoffice_imagens WHERE ordem='4'";
$resultado_foto_quem_somos=$link->query($sql_foto_quem_somos);

$sql_bg1 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='1'";
$resultado_bg1=$link->query($sql_bg1);
if ($resultado_bg1->num_rows > 0) {
    $row_desktop1 = $resultado_bg1->fetch_assoc();
    $image_blob_desk1 = $row_desktop1['imagem'];
    $image_desktop1 = base64_encode($image_blob_desk1);
} 


$sql_bg2 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='2'";
$resultado_bg2=$link->query($sql_bg2);
if ($resultado_bg2->num_rows > 0) {
    $row_desktop2 = $resultado_bg2->fetch_assoc();
    $image_blob_desk2 = $row_desktop2['imagem'];
    $image_desktop2 = base64_encode($image_blob_desk2);
} 

$sql_bg3 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='3'";
$resultado_bg3=$link->query($sql_bg3);
if ($resultado_bg3->num_rows > 0) {
    $row_desktop3 = $resultado_bg3->fetch_assoc();
    $image_blob_desk3 = $row_desktop3['imagem'];
    $image_desktop3 = base64_encode($image_blob_desk3);
} 

$sql_bgt1 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='11'";
$resultado_bgt1=$link->query($sql_bgt1);
if ($resultado_bgt1->num_rows > 0) {
    $row_mobile1 = $resultado_bgt1->fetch_assoc();
    $image_blob_mob1 = $row_mobile1['imagem'];
    $image_mobile1 = base64_encode($image_blob_mob1);
} 

$sql_bgt2 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='12'";
$resultado_bgt2=$link->query($sql_bgt2);
if ($resultado_bgt2->num_rows > 0) {
    $row_mobile2 = $resultado_bgt2->fetch_assoc();
    $image_blob_mob2 = $row_mobile2['imagem'];
    $image_mobile2 = base64_encode($image_blob_mob2);
} 

$sql_bgt3 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='13'";
$resultado_bgt3=$link->query($sql_bgt3);
if ($resultado_bgt3->num_rows > 0) {
    $row_mobile3 = $resultado_bgt3->fetch_assoc();
    $image_blob_mob3 = $row_mobile3['imagem'];
    $image_mobile3 = base64_encode($image_blob_mob3);
} 

$sql_port1 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='5'";
$resultado_port1=$link->query($sql_port1);

$sql_port2 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='6'";
$resultado_port2=$link->query($sql_port2);

$sql_port3 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='7'";
$resultado_port3=$link->query($sql_port3);

$sql_port1_2 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='5'";
$resultado_port1_2=$link->query($sql_port1_2);

$sql_port2_2 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='6'";
$resultado_port2_2=$link->query($sql_port2_2);

$sql_port3_2 = "SELECT * FROM tb_backoffice_imagens WHERE ordem='7'";
$resultado_port3_2=$link->query($sql_port3_2);

$sql_logo_footer = "SELECT * FROM tb_backoffice_imagens WHERE ordem='8'";
$resultado_logo_footer=$link->query($sql_logo_footer);





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
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <link href="css/styles.css" rel="stylesheet" />
        <script src="./js/scripts.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js"></script>

        <style>
            .cookie-modal{
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #fff;
                border: none;
                padding: 20px;
                margin-left: 5%;
                border-radius: 1px;
                text-align: center !important;
                box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.5s ease;
                text-align: right;
            }
            .cookie-modal.show{
                opacity: 1;
            }
            .cookie-modal label{
                margin: 0;
            }
            .cookie-modal button{
                margin-left: 15px;
                margin-bottom: 2px;
            }
            #erropass{
                display: none;
            }
            .overlay{
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                z-index: 9999;
                display: none;
            }
        </style>
    </head>
    <body id="page-top">
        <nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
            <div class="container">
                <a class="navbar-brand" href="#page-top" id="banda">BANDA DE COIMBRÕES</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="collapse navbar-collapse" style="width: 100% !important;" id="navbarResponsive">
                    <ul class="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
                        <li class="nav-item"><a class="nav-link" id="hover" href="#quemsomos">Quem somos</a></li>
                        <li class="nav-item"><a class="nav-link" id="hover" href="#portfolio">Direção</a></li>
                        <li class="nav-item"><a class="nav-link" id="hover" href="#escola">Escola</a></li>
                        <li class="nav-item"><a class="nav-link" id="hover" href="#footer">Contacto</a></li>
                        <li class="nav-item"><a class="nav-link" id="hover" href="#" data-bs-toggle="modal" data-bs-target="#ModalForm">Área Reservada</a></li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="modal fade" id="ModalForm" tabindex="-1" aria-labelledby="ModalFormLabel" aria-hidden="false">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content" style="border: none !important;">
                <div class="modal-body bg-dark">
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div class="myform bg-dark">
                        <h1 class="text-center" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 45px;">Login</h1>
                        <form id="loginForm" action="./elogin.php" method="post">
                            <div class="mb-3 mt-4">
                                <label for="login" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 20px;" class="form-label">Email</label>
                                <input type="text" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: none !important;" class="form-control bg-dark text-light" id="email" name="login" required>
                            </div>
                            <div class="mb-3">
                                <label for="senha" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 20px;" class="form-label">Password</label>
                                <input type="password" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: none !important;" class="form-control bg-dark text-light" name="senha" id="password" required>
                            </div>
                            <div class="alert alert-danger" id="erropass" role="alert">
                            </div>
                            <button type="submit" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 20px;" class="btn btn-light mt-3">Login</button>
                            <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 15px; margin-bottom: 0%;">Esqueceu-se da sua password? <a style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 15px;" href="./esqueceu_password.php">Recuperar</a></p>
                            <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 15px; margin-top: 0%; padding-top: 0%">Pretende tornar-se sócio? <a style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 15px;" href="./inscricao.php">Inscreva-se</a></p>
                        </form>
                    </div>
                </div>
              </div>
            </div>
        </div>

        <div class="overlay" id="overlay"></div>
        <div class="cookie-modal bg-dark" id="cookie" >
            <label style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 20px; color:#fff;" class="cookie-text display-5">Este site utiliza cookies para que obtenha uma melhor experiência.</label>
            <button onclick="dimissModal()" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 20px; border-radius:none;" class="btn btn-light">Ok</button>
        </div>       

        <div class="carousel">
            <div id="carouselExampleIndicators" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-pause="false">
                <div class="carousel-indicators">
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active" data-bs-interval="4000">
                    <picture>
                        <source media="(min-width: 650px)" style="width: 100%; height: 100%; object-fit: cover;" srcset="data:image/jpeg;base64,<?php echo $image_desktop1; ?>">
                        <source media="(max-width: 650px)" style="width: 100%; height: 100%; object-fit: cover;"  srcset="data:image/jpeg;base64,<?php echo $image_mobile1; ?>">
                        <img src="data:image/jpeg;base64,<?php echo $image_desktop1; ?>" alt="Imagem" style="width: 100%; height: 100%; object-fit: cover;">
                    </picture>
                    </div>
                  <div class="carousel-item" data-bs-interval="4000">
                    <picture>
                        <source media="(min-width: 650px)" style="width: 100%; height: 100%; object-fit: cover;" srcset="data:image/jpeg;base64,<?php echo $image_desktop2; ?>">
                        <source media="(max-width: 650px)" style="width: 100%; height: 100%; object-fit: cover;"  srcset="data:image/jpeg;base64,<?php echo $image_mobile2; ?>">
                        <img src="data:image/jpeg;base64,<?php echo $image_desktop2; ?>" alt="Imagem" style="width: 100%; height: 100%; object-fit: cover;">
                    </picture>
                  </div>
                  <div class="carousel-item" data-bs-interval="4000">
                    <picture>
                        <source media="(min-width: 650px)" style="width: 100%; height: 100%; object-fit: cover;" srcset="data:image/jpeg;base64,<?php echo $image_desktop3; ?>">
                        <source media="(max-width: 650px)" style="width: 100%; height: 100%; object-fit: cover;"  srcset="data:image/jpeg;base64,<?php echo $image_mobile3; ?>">
                        <img src="data:image/jpeg;base64,<?php echo $image_desktop3; ?>" alt="Imagem" style="width: 100%; height: 100%; object-fit: cover;">
                    </picture>
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
              </div>
            </div>
        
        <section class="page-section bg-white" id="section_soc">
            <div class="container">
                <div class="text-center">
                    <img src="./assets/img/logos/logo.png">
                    <h2 class="section-heading text-uppercase" id="soc">Sociedade Musical 1º de Agosto</h2>
                </div>
            </div>
        </section>
        <section class="page-section" id="quemsomos">
            <div class="container">
                <div class="text-center">
                    <h2 class="section-heading text-uppercase" id="quem">Quem somos</h2>
                    <?php if ($resultado_quemsomos->num_rows>0){
                while ($row_quemsomos = $resultado_quemsomos->fetch_assoc()){
                    echo "<p class='text-muted text-center'>".$row_quemsomos['conteudo']."</p>"; 
                }}?>
                </div>
                <p>
                <div class="row text-center">
                <?php
                    if ($resultado_foto_quem_somos->num_rows > 0) {
                        $row_foto = $resultado_foto_quem_somos->fetch_assoc();
                        $image_src_quem = $row_foto['imagem'];
                        echo '<img src="data:image/jpeg;base64,' . base64_encode($image_src_quem) . '" style="width: 100%; height: 100%; object-fit: cover;">';
                    }
                ?>
                </div>
            </div>
        </section>
        <section class="page-section bg-light" id="portfolio">
            <div class="container">
                <div class="text-center">
                    <h2 class="section-heading text-uppercase">Direção</h2>
                    <h3 class="section-subheading text-muted">Membros</h3>
                </div>
                <div class="row">
                    <div class="col-lg-4 col-sm-6 mb-4">
                        <div class="portfolio-item">
                            <a class="portfolio-link" data-bs-toggle="modal" href="#portfolioModal1">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                </div>
                                <?php
                                    if ($resultado_port1->num_rows > 0) {
                                        $row_port1 = $resultado_port1->fetch_assoc();
                                        $image_src_port1 = $row_port1['imagem'];
                                        echo '<img src="data:image/jpeg;base64,' . base64_encode($image_src_port1) . '" style="width: 100%; height: 100%; object-fit: cover;">';
                                    }
                                ?>
                            </a>
                            <div class="portfolio-caption">
                                <div class="portfolio-caption-heading"><?php  if ($resultado_modal1_title->num_rows>0){
                                while ($row_modal1_title = $resultado_modal1_title->fetch_assoc()){
                                echo $row_modal1_title['conteudo']; 
                                }}?></div>
                                <div class="portfolio-caption-subheading text-muted"><?php  if ($resultado_modal1_name->num_rows>0){
                                while ($row_modal1_name = $resultado_modal1_name->fetch_assoc()){
                                echo $row_modal1_name['conteudo']; 
                                }}?></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-sm-6 mb-4">
                        <div class="portfolio-item">
                            <a class="portfolio-link" data-bs-toggle="modal" href="#portfolioModal2">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                </div>
                                <?php
                                    if ($resultado_port2->num_rows > 0) {
                                        $row_port2 = $resultado_port2->fetch_assoc();
                                        $image_src_port2 = $row_port2['imagem'];
                                        echo '<img src="data:image/jpeg;base64,' . base64_encode($image_src_port2) . '" style="width: 100%; height: 100%; object-fit: cover;">';
                                    }
                                ?>
                            </a>
                            <div class="portfolio-caption">
                                <div class="portfolio-caption-heading"><?php  if ($resultado_modal2_title->num_rows>0){
                                while ($row_modal2_title = $resultado_modal2_title->fetch_assoc()){
                                echo $row_modal2_title['conteudo']; 
                                }}?></div>
                                <div class="portfolio-caption-subheading text-muted"><?php  if ($resultado_modal2_name->num_rows>0){
                                while ($row_modal2_name = $resultado_modal2_name->fetch_assoc()){
                                echo $row_modal2_name['conteudo']; 
                                }}?></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-sm-6 mb-4">
                        <div class="portfolio-item">
                            <a class="portfolio-link" data-bs-toggle="modal" href="#portfolioModal3">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                </div>
                                <?php
                                    if ($resultado_port3->num_rows > 0) {
                                        $row_port3 = $resultado_port3->fetch_assoc();
                                        $image_src_port3 = $row_port3['imagem'];
                                        echo '<img src="data:image/jpeg;base64,' . base64_encode($image_src_port3) . '" style="width: 100%; height: 100%; object-fit: cover;">';
                                    }
                                ?>
                            </a>
                            <div class="portfolio-caption">
                                <div class="portfolio-caption-heading"><?php  if ($resultado_modal3_title->num_rows>0){
                                while ($row_modal3_title = $resultado_modal3_title->fetch_assoc()){
                                echo $row_modal3_title['conteudo']; 
                                }}?></div>
                                <div class="portfolio-caption-subheading text-muted"><?php  if ($resultado_modal3_name->num_rows>0){
                                while ($row_modal3_name = $resultado_modal3_name->fetch_assoc()){
                                echo $row_modal3_name['conteudo']; 
                                }}?></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="page-section" id="escola">
            <div class="container">
                <div class="text-center">
                    <h2 class="section-heading text-uppercase">Escola</h2>
                    <h3 class="section-subheading text-muted mb-0">A nossa escola de música</h3>
                </div>
                <?php if ($resultado_escola->num_rows>0){
                while ($row_escola = $resultado_escola->fetch_assoc()){
                   echo "<p class='text-muted text-center'>".$row_escola['conteudo']."</p>"; 
                }}?>
        </section> 

        
        <footer class="footer-section" id="footer">
            <div class="container">
                <div class="footer-cta pt-5 pb-5">
                    <div class="text-center">
                        <p></p>
                        <h2 class="section-heading text-uppercase" id="contact">Contacte-nos</h2>
                        <h3 class="section-subheading text-muted" id="request">Requisite os nossos serviços</h3>
                    </div>
                    <div class="row">
                        <div class="col-xl-4 col-md-4 mb-30">
                            <div class="single-cta">
                                <i class="fas fa-map-marker-alt"></i>
                                <div class="cta-text">
                                    <h4 style="margin-left: -15%;">Sede</h4>
                                    <span><?php  if ($resultado_morada->num_rows>0){
                                        while ($row_morada = $resultado_morada->fetch_assoc()){
                                        echo $row_morada['conteudo']; 
                                    }}?></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-4 col-md-4 mb-30">
                            <div class="single-cta">
                                <i class="fas fa-phone"></i>
                                <div class="cta-text">
                                    <h4 style="margin-left: -40%;">Telefone</h4>
                                    <span><?php  if ($resultado_telefone->num_rows>0){
                                        while ($row_telefone = $resultado_telefone->fetch_assoc()){
                                        echo $row_telefone['conteudo']; 
                                    }}?></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-4 col-md-4 mb-30">
                            <div class="single-cta">
                                <i class="far fa-envelope-open"></i>
                                <div class="cta-text">
                                    <h4 style="margin-left: -18%;">Email</h4>
                                    <span><?php  if ($resultado_email->num_rows>0){
                                        while ($row_email = $resultado_email->fetch_assoc()){
                                        echo $row_email['conteudo']; 
                                    }}?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-content pt-5 pb-5">
                    <div class="row">
                        <div class="col-xl-4 col-lg-4 mb-50">
                            <div class="footer-widget">
                                <div class="footer-logo">
                                    <a href="#page-top"><?php
                                    if ($resultado_logo_footer->num_rows > 0) {
                                        $row_logo = $resultado_logo_footer->fetch_assoc();
                                        $image_src_logo = $row_logo['imagem'];
                                        echo '<img src="data:image/jpeg;base64,' . base64_encode($image_src_logo) . '" style="width: 100%; height: 100%; object-fit: cover;">';
                                    }
                                ?></a>
                                </div>
                                
                            </div>
                        </div>
                        <div class="col-xl-4 col-lg-4 col-md-6 mb-30">
                            <div class="footer-widget">
                                <div class="footer-widget-heading">
                                    <h3>Links</h3>
                                </div>
                                <ul>
                                    <li><a href="#quemsomos">Quem Somos</a></li>
                                    <li><a href="#portfolio">Direção</a></li>
                                    <li><a href="#escola">Escola</a></li>
                                    <li><a href="#" data-bs-toggle="modal" data-bs-target="#ModalForm">Área Reservada</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-xl-4 col-lg-4 col-md-6 mb-50">
                            <div class="footer-widget">
                                <div class="footer-widget-heading">
                                    <h3>Siga-nos</h3>
                                </div>
                                <div class="footer-social-icon">
                                    <a href="<?php if ($resultado_facebook->num_rows>0){
                                    while ($row_facebook = $resultado_facebook->fetch_assoc()){
                                    echo $row_facebook['conteudo']; 
                                    }}?>"><i class="fab fa-facebook-f"></i></a>
                                    <a href="<?php if ($resultado_instagram ->num_rows>0){
                                    while ($row_instagram = $resultado_instagram->fetch_assoc()){
                                    echo $row_instagram['conteudo']; 
                                    }}?>"><i class="fab fa-instagram"></i></a>
                                    <a href="<?php if ($resultado_youtube ->num_rows>0){
                                    while ($row_youtube = $resultado_youtube->fetch_assoc()){
                                    echo $row_youtube['conteudo']; 
                                    }}?>"><i class="fab fa-youtube"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>


        <div class="portfolio-modal modal fade" id="portfolioModal1" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-xl bg-white">
                <div class="modal-content"> 
                    <div class="close-modal" style="float: right !important;" data-bs-dismiss="modal"><img src="assets/img/close-icon.svg" alt="Close modal" /></div>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <div class="modal-body">
                                    <h2 class="text-uppercase"><?php  if ($resultado_modal1_title_2->num_rows>0){
                                    while ($row_modal1_title_2 = $resultado_modal1_title_2->fetch_assoc()){
                                    echo $row_modal1_title_2['conteudo']; 
                                    }}?></h2>
                                    <p class="item-intro text-muted"><?php  if ($resultado_modal1_descricao->num_rows>0){
                                        while ($row_modal1_descricao = $resultado_modal1_descricao->fetch_assoc()){
                                        echo $row_modal1_descricao['conteudo']; 
                                    }}?></p>
                                    <?php
                                    if ($resultado_port1_2->num_rows > 0) {
                                        $row_port1_2 = $resultado_port1_2->fetch_assoc();
                                        $image_src_port1_2 = $row_port1_2['imagem'];
                                        echo '<img src="data:image/jpeg;base64,' . base64_encode($image_src_port1_2) . '" style="width: 100%; height: 100%; object-fit: cover;">';
                                    }
                                    ?>
                                    <?php  if ($resultado_port1_texto->num_rows>0){
                                        while ($row_port1_texto = $resultado_port1_texto->fetch_assoc()){
                                        echo "<p>".$row_port1_texto['conteudo']."</p>"; 
                                    }}?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="portfolio-modal modal fade" id="portfolioModal2" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-xl bg-white">
                <div class="modal-content">
                    <div class="close-modal" data-bs-dismiss="modal"><img src="assets/img/close-icon.svg" alt="Close modal" /></div>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <div class="modal-body">
                                    <h2 class="text-uppercase"><?php  if ($resultado_modal2_title_2->num_rows>0){
                                    while ($row_modal2_title_2 = $resultado_modal2_title_2->fetch_assoc()){
                                    echo $row_modal2_title_2['conteudo']; 
                                    }}?></h2></h2>
                                    <p class="item-intro text-muted"><?php  if ($resultado_modal2_descricao->num_rows>0){
                                        while ($row_modal2_descricao = $resultado_modal2_descricao->fetch_assoc()){
                                        echo $row_modal2_descricao['conteudo']; 
                                    }}?></p>
                                    <?php
                                    if ($resultado_port2_2->num_rows > 0) {
                                        $row_port2_2 = $resultado_port2_2->fetch_assoc();
                                        $image_src_port2_2 = $row_port2_2['imagem'];
                                        echo '<img src="data:image/jpeg;base64,' . base64_encode($image_src_port2_2) . '" style="width: 100%; height: 100%; object-fit: cover;">';
                                    }
                                    ?>
                                    <?php  if ($resultado_port2_texto->num_rows>0){
                                        while ($row_port2_texto = $resultado_port2_texto->fetch_assoc()){
                                        echo "<p>".$row_port2_texto['conteudo']."</p>"; 
                                    }}?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="portfolio-modal modal fade" id="portfolioModal3" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-xl bg-white">
                <div class="modal-content">
                    <div class="close-modal" data-bs-dismiss="modal"><img src="assets/img/close-icon.svg" alt="Close modal" /></div>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <div class="modal-body">
                                    <h2 class="text-uppercase"><?php  if ($resultado_modal3_title_2->num_rows>0){
                                    while ($row_modal3_title_2 = $resultado_modal3_title_2->fetch_assoc()){
                                    echo $row_modal3_title_2['conteudo']; 
                                    }}?></h2>
                                    <p class="item-intro text-muted"><?php  if ($resultado_modal3_descricao->num_rows>0){
                                        while ($row_modal3_descricao = $resultado_modal3_descricao->fetch_assoc()){
                                        echo $row_modal3_descricao['conteudo']; 
                                    }}?></p>
                                    <?php
                                    if ($resultado_port3_2->num_rows > 0) {
                                        $row_port3_2 = $resultado_port3_2->fetch_assoc();
                                        $image_src_port3_2 = $row_port3_2['imagem'];
                                        echo '<img src="data:image/jpeg;base64,' . base64_encode($image_src_port3_2) . '" style="width: 100%; height: 100%; object-fit: cover;">';
                                    }
                                    ?>
                                    <?php  if ($resultado_port3_texto->num_rows>0){
                                        while ($row_port3_texto = $resultado_port3_texto->fetch_assoc()){
                                        echo "<p>".$row_port3_texto['conteudo']."</p>"; 
                                    }}?>
                                </div>
                            </div>
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
                    message: 'Inscrição registada com sucesso.',
                    position: 'topRight',
                    timeout: 5000 
                });
                localStorage.removeItem('sucesso');
            }

            var erro = localStorage.getItem('erro1');
            if (erro) {
                iziToast.error({
                    title: 'Erro',
                    message: 'Ocorreu um erro.',
                    position: 'topRight',
                    timeout: 5000 
                });
                localStorage.removeItem('erro1');
            }

            var cookieAccepted = false;

            window.onload = function() {
                var modal = document.getElementById('cookie');
                modal.classList.add('show');
                
                let cookies = localStorage.getItem("cookieAccepted");
                if(cookies == undefined){
                    document.getElementById("overlay").style.display = "block"; 
                }
                else if(cookies == 'true'){
                    document.getElementById("cookie").style.display = "none";
                    document.getElementById("overlay").style.display = "none";
                }
            };

            function dimissModal() {
                var modal = document.getElementById('cookie');
                modal.classList.remove('show');
                document.getElementById("overlay").style.display = "none"; 
                localStorage.setItem('cookieAccepted', 'true');
            }

            $(document).ready(function(){
                let erro = localStorage.getItem("erro");
                if(erro != null){
                    $('#ModalForm').modal('show');
                    $("#erropass").text(erro);
                    document.getElementById("erropass").style.display = "block";
                    localStorage.removeItem("erro");
                }
            });

        </script>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>    
        <script src="js/scripts.js"></script>
        <script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>
    </body>
</html>


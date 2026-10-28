<style>
    .sidebar{
        transition: width 0.3s ease;
    }
</style>
<div id="wrapper">
        <ul class="navbar-nav bg-dark sidebar sidebar-dark accordion" id="accordionSidebar" style="background-color: #1c1c1c !important;">

<a class="sidebar-brand d-flex align-items-center justify-content-center" href="home.php">
    <div class="sidebar-brand-icon">
        <i class="fas fa-home"></i>
    </div>
    <div class="sidebar-brand-text mx-3">Área Reservada</div>
</a>
<hr class="sidebar-divider my-0">
<li class="nav-item">
    <a class="nav-link" href="home.php">
        <i class="fas fa-tag"></i>
        <span>Home</span></a>
</li>
<hr class="sidebar-divider">
<div class="sidebar-heading">
            Músico
</div>
<li class="nav-item">
    <a class="nav-link" href="./calendario.php">
        <i class="fas fa-calendar"></i>
        <span>Calendário</span></a>
</li>
<li class="nav-item">
    <a class="nav-link" href="./presencas.php">
        <i class="fas fa-list"></i>
        <span>Presenças</span></a>
</li>
<li class="nav-item">
    <a class="nav-link" href="./historico_presencas.php">
        <i class="fas fa-history"></i>
        <span>Histórico de Presenças</span></a>
</li>
<li class="nav-item">
    <a class="nav-link" href="./caderneta.php">
        <i class="fas fa-scroll"></i>
        <span>Caderneta</span></a>
</li>
<hr class="sidebar-divider d-none d-md-block">
<div class="sidebar-heading">
    Sócio
</div>
<li class="nav-item">
    <a class="nav-link" href="./cotas_socio.php">
        <i class="fas fa-euro-sign"></i>
        <span>Cotas</span></a>
</li>
<hr class="sidebar-divider d-none d-md-block">
<div class="sidebar-heading">
    Perfil
</div>
<li class="nav-item">
    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages"
        aria-expanded="true" aria-controls="collapsePages">
        <i class="fas fa-user"></i>
        <span>Eu</span>
    </a>
    <div id="collapsePages" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
        <div class="bg-white py-2 collapse-inner rounded">
            <h6 class="collapse-header">EU:</h6>
            <a class="collapse-item" href="./conta_musico.php">Perfil</a>
            <a class="collapse-item" href="../logout.php">Logout</a>
        </div>
    </div>
</li>
<hr class="sidebar-divider d-none d-md-block">
<div class="text-center d-none d-md-inline">
    <button class="rounded-circle border-0" id="sidebarToggle"></button>
</div>
</ul>
<div id="content-wrapper" class="d-flex flex-column">
<div id="content mb-0">
<button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
    <i class="fa fa-bars" style="color: grey;"></i>
</button>
</div>

<script>
    $(document).ready(function(){
        $('#sidebarToggle').on('click', function(){
            $('#accordionSidebar').toggleClass('toggled');
        })
    })
</script>
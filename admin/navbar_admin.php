<style>
    .sidebar{
        transition: width 0.3s ease;
    }
</style>
<div id="wrapper">
    <ul class="navbar-nav bg-dark sidebar sidebar-dark accordion" id="accordionSidebar" style="background-color: #1c1c1c !important;">

        <a class="sidebar-brand d-flex align-items-center justify-content-center" href="home_admin.php">
            <div class="sidebar-brand-icon">
                <i class="fas fa-home"></i>
            </div>
            <div class="sidebar-brand-text mx-3">Área Reservada</div>
        </a>
        <hr class="sidebar-divider my-0">
        <li class="nav-item">
            <a class="nav-link" href="home_admin.php">
                <i class="fas fa-tag"></i>
                <span>Home</span></a>
        </li>
        <hr class="sidebar-divider">
        <div class="sidebar-heading">
            Direção
        </div>
        <li class="nav-item">
            <a class="nav-link" href="./utilizadores.php">
                <i class="fas fa-user"></i>
                <span>Utilizadores</span></a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="./ver_inscricoes.php">
                <i class="fas fa-check"></i>
                <span>Aprovar inscrições</span></a>
        </li>
        <li class="nav-item">
            <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities"
                aria-expanded="true" aria-controls="collapseUtilities">
                <i class="fas fa-calendar"></i>
                <span>Calendário</span>
            </a>
            <div id="collapseUtilities" class="collapse" aria-labelledby="headingUtilities"
                data-parent="#accordionSidebar">
                <div class="bg-white py-2 collapse-inner rounded">
                    <h6 class="collapse-header">Calendário:</h6>
                    <a class="collapse-item" href="./calendario_admin.php">Ver</a>
                    <a class="collapse-item" href="./gerir_servicos.php">Gerir</a>
                </div>
            </div>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="./servicos.php">
                <i class="fas fa-list"></i>
                <span>Presenças</span></a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="./caderneta.php">
                <i class="fas fa-scroll"></i>
                <span>Caderneta</span></a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="./cotas.php">
                <i class="fas fa-euro-sign"></i>
                <span>Cotas</span></a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="./backoffice.php">
                <i class="fas fa-pen"></i>
                <span>Backoffice</span></a>
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
                    <a class="collapse-item" href="./conta.php">Perfil</a>
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
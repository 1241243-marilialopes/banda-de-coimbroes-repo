<?php
    require_once('config.php');

    if(!isset($_POST['login'],$_POST['senha'])){
        die('Preencha os dados do Utilizador');
    }

    if($stmt = $link->prepare('SELECT id_utilizador,nome_utilizador,senha, cargo_id FROM tb_utilizadores WHERE email = ?')){
        
        $stmt->bind_param('s',$_POST['login']);
        $stmt->execute();
        $stmt->store_result();

        if($stmt->num_rows > 0){
            $stmt->bind_result($id,$nome,$senha,$cargo);
            $stmt->fetch();

            $senha_post=$_POST['senha'];
            if(password_verify($senha_post, $senha)){
                    // admin, sócio
                    if( $cargo == 0){
                        session_regenerate_id();
                        $_SESSION['log-in'] = TRUE;
                        $_SESSION['nome'] = $nome;
                        $_SESSION['email'] = $_POST['login'];
                        $_SESSION['id'] = $id;
                        
                        header('Location: admin/home_admin.php');
                    }
                    // musico, sócio
                    else if( $cargo == 1){
                        session_regenerate_id();
                        $_SESSION['log-in'] = TRUE;
                        $_SESSION['nome'] = $nome;
                        $_SESSION['email'] = $_POST['login'];
                        $_SESSION['id'] = $id;
                        
                        header('Location: musicos_socios/home.php');
                    }
                    // admin, socio, musico
                    else if( $cargo == 2){
                        session_regenerate_id();
                        $_SESSION['log-in'] = TRUE; 
                        $_SESSION['nome'] = $nome;
                        $_SESSION['email'] = $_POST['login'];
                        $_SESSION['id'] = $id;
                        
                        header('Location: admin_musico_socio/home_admin_musico_socio.php');
                    }
                    // socio
                    else if( $cargo == 3){
                        session_regenerate_id();
                        $_SESSION['log-in'] = TRUE; 
                        $_SESSION['nome'] = $nome;
                        $_SESSION['email'] = $_POST['login'];
                        $_SESSION['id'] = $id;
                        
                        header('Location: socios/home_socios.php');
                    }
            }
            else{
                echo"
                <script>
                    localStorage.setItem('erro', 'Password Incorreta');
                    setTimeout(function() {
                        window.location.href = 'index.php';
                    }, 100);
                </script>";
            }
        }
        else{
            echo"
            <script>
                localStorage.setItem('erro', 'Email Incorreto');
                setTimeout(function() {
                    window.location.href = 'index.php';
                });
            </script>";
        }
    }

?>
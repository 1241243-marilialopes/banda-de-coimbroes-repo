<?php 

require_once("../config.php");

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(isset($_POST['elemento_id'], $_POST['tipo_elemento'])){
        $elemento_id = $_POST['elemento_id'];
        $tipo_elemento = $_POST['tipo_elemento'];
        
        // se for texto
        if(empty($_FILES['imagem']['name'])){
            $novo = $_POST['conteudo'];
            $sql = "UPDATE tb_backoffice SET conteudo = ? WHERE id_elemento = ?";
            if($stmt=$link->prepare($sql)){
                $stmt->bind_param("si", $novo, $elemento_id);
                if($stmt->execute()){
                    echo"
                    <script>
                        localStorage.setItem('sucesso', 'sucesso');
                        setTimeout(function() {
                            window.location.href = 'backoffice.php';
                        }, 100);
                    </script>";
                    exit();
                }
                else{
                    echo"
                    <script>
                        localStorage.setItem('erro', 'erro');
                        setTimeout(function() {
                            window.location.href = 'backoffice.php';
                        });
                    </script>";
                }
            }
            else{
                echo"
                <script>
                    localStorage.setItem('erro', 'erro');
                    setTimeout(function() {
                        window.location.href = 'backoffice.php';
                    });
                </script>";
            }
            $stmt->close();
        }
        //se for imagem
        elseif($_FILES['imagem']['error'] == UPLOAD_ERR_OK){
            $nome_arquivo = $_FILES['imagem']['name'];
            $foto = file_get_contents($_FILES['imagem']['tmp_name']);

            $sql="UPDATE tb_backoffice_imagens SET imagem = ?, nome_imagem = ? WHERE id_imagem = ?";
            if($stmt=$link->prepare($sql)){
                $stmt->bind_param("ssi", $foto,$nome_arquivo,$elemento_id);
                if($stmt->execute()){
                    echo"
                    <script>
                        localStorage.setItem('sucesso', 'sucesso');
                        setTimeout(function() {
                            window.location.href = 'backoffice.php';
                        }, 100);
                    </script>";
                    exit();
                }
                else{
                    echo"
                    <script>
                        localStorage.setItem('erro', 'erro');
                        setTimeout(function() {
                            window.location.href = 'backoffice.php';
                        });
                    </script>";
                }
                $stmt->close();
            }
            else{
                echo"
                <script>
                    localStorage.setItem('erro', 'erro');
                    setTimeout(function() {
                        window.location.href = 'backoffice.php';
                    });
                </script>";
            }
            $link->close();

        }
        else{
            echo"
            <script>
                localStorage.setItem('erro', 'erro');
                setTimeout(function() {
                    window.location.href = 'backoffice.php';
                });
            </script>";
        }
    }
    else{
        echo"
        <script>
            localStorage.setItem('erro', 'erro');
            setTimeout(function() {
                window.location.href = 'backoffice.php';
            });
        </script>";
    }
}
?>
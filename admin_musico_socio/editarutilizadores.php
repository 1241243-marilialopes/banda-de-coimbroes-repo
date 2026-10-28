  <?php

require_once("../config.php");

$id_utilizador=$_POST["id_utilizador"];
$nome_utilizador=$_POST['nome'];
$telemovel=$_POST["telemovel"];
$cc=$_POST["cc"];
$nif=$_POST["nif"];
$data_nascimento= $_POST["data"];
$email= $_POST["email"];
$instrumento=$_POST['instrumento'];
$genero=$_POST['genero'];
$cargo=$_POST['cargo'];

if(isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
    $nome_imagem = $_FILES["foto_perfil"]["name"];
    $foto = file_get_contents($_FILES['foto_perfil']['tmp_name']);
} else {
    $query = "SELECT foto_perfil, nome_foto FROM tb_utilizadores WHERE id_utilizador=?";
    if($stmt = $link ->prepare($query)){
        $stmt->bind_param("i",$id_utilizador);
        $stmt->execute();
        $stmt->bind_result($foto_perfil,$nome_foto);
        $stmt->fetch();
        $foto = $foto_perfil;
        $nome_imagem=$nome_foto;
        $stmt->close();
    } 
}

$sql="UPDATE tb_utilizadores SET nome_utilizador=?, foto_perfil=?, nome_foto=?, telemovel=?, numero_cc=?, nif=?, data_nascimento=?, email=?, instrumento=?, genero_id=?, cargo_id=? where id_utilizador=?";
if($stmt=$link->prepare($sql)){
    $stmt->bind_param("sssiiissiiii", $nome_utilizador, $foto, $nome_imagem, $telemovel, $cc, $nif, $data_nascimento,$email,$instrumento,$genero,$cargo,$id_utilizador);
    if($stmt->execute()){
        echo"
        <script>
            localStorage.setItem('sucesso', 'sucesso');
            setTimeout(function() {
                window.location.href = 'utilizadores.php';
            }, 100);
        </script>";
    }
    else{
        echo"
        <script>
            localStorage.setItem('erro', 'erro');
            setTimeout(function() {
                window.location.href = 'utilizadores.php';
            });
        </script>";
    }
    $stmt->close();
    $link->close();

}
else{
    echo"
    <script>
        localStorage.setItem('erro', 'erro');
        setTimeout(function() {
            window.location.href = 'utilizadores.php';
        });
    </script>";
}
?>
window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        new simpleDatatables.DataTable("#datatablesSimple", {
            labels: {
                placeholder: "Procurar",
                searchTitle: "Procurar na Tabela",
                perPage: "Linhas por página",
                noRows: "Sem informação",
                info: "A mostrar de {start} a {end} de um total de {rows} linhas",
                noResults: "Sem Resultados",
            }
        });
    }
});

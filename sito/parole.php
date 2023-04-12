<!doctype html><?php
error_reporting(-1);
ini_set('display_errors', 'On');
if (isset($_POST['parole'])) {
    $input = strtolower(trim($_POST['parole']));
    $linee = preg_split("/\r\n|\n|\r/", $input);
    $tot = count($linee);
    $db = new SQLite3('parole.db');
    $db->enableExceptions(true);
    $smt = $db->prepare("INSERT INTO parole(parole) VALUES(?)");
    $inserite = 0;
    foreach ($linee as $linea) {
        $linea = preg_replace("/[^a-zA-Z ']/", "", $linea);
        $linea = trim($linea);
        if ($linea) {
            $smt->bindValue(1, $linea, SQLITE3_TEXT);
            //try {
                $smt->execute();
                $inserite++;
            //} catch (Exception $e) {
                // NOP
            //}
        }
    }
}
?><html lang="it">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <title>Count to 10 - Raccolta dati</title>
  </head>
  <body>
    <header>
    <nav class="navbar bg-body-tertiary" style="background-color: #ADD8E6">
    <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Count to 10 - Raccolta dati</span>
    </div>
    </nav>
    </header>
    <main>
    <div class="container">
    <img src="assets/img/logo.png" style="height: 150px">
    <?php if (isset($_POST['parole'])) { ?>
    <div class="alert alert-info" role="alert">
        Hai inserito <?= $inserite ?> parole.
    </div>
    <?php } ?>
    <form action="parole.php" method="post">
        <div class="mb-3">
            <label for="parole" class="form-label">Parole o brevi espressioni ingiuriose ed oscene (una per riga)</label>
            <textarea class="form-control" id="parole" name="parole" rows="10"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Invia</button>
    </form>
    </div> <!-- .container -->
    </main>
    <!-- Option 1: Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

    <!-- Option 2: Separate Popper and Bootstrap JS -->
    <!--
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
    -->
  </body>
</html>

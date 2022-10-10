<?php
if (isset($_POST['your-name']) && isset($_POST['your-phone']) && isset($_POST['your-email']) && isset($_POST['your-message']))
{
    $name = $_POST['your-name'];
    $phone = $_POST['your-phone'];
    $mailFrom = $_POST['your-email'];
    $message = $_POST['your-message'];

    $mailTo = "info@duschfit.ch";
    $headers = "From: " . $mailFrom;
    $txt = "You have received an e-mail from " . $name . ".\n\n" . $message;

    mail($mailTo, $subject, $txt, $headers);
    header("Location: https://duschfit.ch/contacts?mailsend");
}
?>

<?php
    ob_start();
    if($_POST['js']) {
        $name = stripslashes($_POST['yourname']);
        $email = stripslashes($_POST['email']);
        $website = stripslashes($_POST['website']);
        $tel = stripslashes($_POST['tel']);
        $standard = stripslashes($_POST['standard']);
        $preference = stripslashes($_POST['contact_pref']);
        $noprint = stripslashes($_POST['no-print']);

        $message  = '<h1>'.$name .' has just ordered a DSQS Audit!</h1>';

        $message .= '<p><h2>Contact details</h2>';
        $message .= '<strong>Email:</strong> <a href="mailto:'.$email.'">'.$email.'</a><br />';
        if ($tel) $message .= '<strong>Telephone number:</strong> ' .$tel. '<br />';
        if ($preference !== null) $message .= 'They would prefer to be contacted by ' . $preference . '</br>';
        if ($website) $message .= '<strong>The site which requires auditing is:</strong> <a href="'.$website.'">' .$website. '</a><br />';
        $message .= '<p>They would like to order the ' .$standard. ' standard audit.</p><br />';
        if ($noprint) $message .= '<p> They do not require a printed copy </p>';
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'From: no-reply@bbqdigital.com' . "\r\n" ;
        $headers .= 'Reply-To: no-reply@bbqdigital.com' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
       mail($email, 'Your order has been received', "Thank you for placing your order, we will contact you within three working days to confirm your details", $headers);
       mail('sayhi@bbqdigital.com', 'Email from BBQ Website', $message, $headers);
       header('Location: '. '/order?posted=true');
       die();
    } else {
      header('Location: '. '/error');
    }
?>

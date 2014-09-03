<?php
    if($_POST['submit']) {
        $name = stripslashes($_POST['yourname']);
        $enquiry = stripslashes($_POST['enquiry']);
        $email = stripslashes($_POST['email']);
        $website = stripslashes($_POST['website']);
        $tel = stripslashes($_POST['tel']);

        $message = '<p>The BBQ website just received a message from <a href="mailto:'.$email.'">'.$name.'</a>, they can be reached at '.$tel.'.</p> <p><strong>Here is their message:</strong></p><p>"'.$enquiry.'"</p><p>Here is their website: '.$website.;
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
       mail('alex.ward@bbqdigital.com', 'Email from BBQ Website', $message, $headers);

       header('Location: '. '/contact-us.html?posted=true');
       die();
    }
?>

import React from "react";
import "./index.scss"
import {Chevron} from "../../common/chevron/Chevron";

const WelcomeCard = () => {
    return (
        <div id={"welcomeCard"}>
            <div className={"welcome-card-text"}>
                <h3>Wander.</h3>
                <p>
                    Logoden biniou degemer mat an penn ar bed biskoazh kenañ kalz o ar ha, walc’h ar taol me a-raok a
                    war gallek ma warnomp magañ.
                    Nemet bourc’h er o forzh talvoudus barzh niver spi kae kelc’h kempenn karout
                    beajiñ, ar koulz da davañjer martolod ac'hanout gegin e kleiz enez hantereur.
                    Fiñval kempenn torchañ c’hroaz anezho iskis bann muiañ pesk, daou liv dra lezen
                    n berr redek evit brumenn ganit, c’houevr derc’hel da glac’har tour sklaer pes
                    keta. Breizh un dija Pembo stlakañ naon bag lenn livañ, maneg oaled egistout.
                </p>
            </div>
            <Chevron/>
        </div>
    )
}

export default WelcomeCard

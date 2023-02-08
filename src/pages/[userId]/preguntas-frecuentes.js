
import { useEffect } from 'react';
import Cookie from 'js-cookie'
import { useRouter } from 'next/router';

import Banner from '../../components/Banner';
import FaqItem from '../../components/FaqItem';

export default function Faqs() {

  const router = useRouter()

    const preguntasFaq = [
        {cod:'1', title: '¿Qué hacer si no inicié viaje y me cambiaron la fecha?',detail:'En este caso, se puede comunicar telefónicamente al: 4814- 9055 o enviar un e-mail a telemarketing@europ-assistance.com.ar indicando su número de voucher, nombre y apellido y DNI así podemos cambiar las fechas de viaje, sin costo, siempre y cuando sea por la misma cantidad de días. En caso de adicionar días, se cotiza la diferencia y se emite un nuevo voucher.'},
        {cod:'2', title: '¿Cómo debo proceder si durante mi viaje necesito asistencia?',detail:'Lo primero que debe saber es que necesita contactarse con Europ Assistance para dar aviso y luego le informarán como debe proceder. Cuando te comuniques a nuestra línea de Asistencia, indícanos tu número de póliza, el motivo de tu asistencia y dónde te encuentras.<p>Los medios disponibles para contactarse son:</p><ul class="list-disc mt-2 ml-4"><li>Tel: (+ 54 11) 4814-9051. En forma directa por Cobro Revertido, desde cualquier parte del mundo.</li><li>Whatsapp: +54 9 11 3314-2044</li><li>E-mail: operaciones@europ-assistance.com.ar</li></ul>'},
        {cod:'3', title: '¿Tengo que llevar impresa mi cobertura?',detail:'Es importante que averigües dependiendo el destino al que viajes. En muchos lugares no es necesario contar con la asistencia impresa, pero en otros como el ingreso a la Comunidad Europa conviene contar con el voucher impreso ya que seguramente te lo soliciten para el ingreso. <p>Al contratar nuestro servicio, enviamos el voucher por e-mail con un código QR que podes presentar donde necesiten verificar la cobertura.</p>'},
        {cod:'4', title: '¿Existe algún límite por enfermedades crónicas o pre-existentes?',detail:'Si, varía según el producto contratado desde 200 USD hasta 1.000 USD. Puede contratarse un Up grade al momento de adquirir el servicio y aumentar este límite hasta 30.000 USD. Los productos EA NACIONAL, ENERGY y EXTREME no tienen esta prestación.'},
        {cod:'5', title: '¿Qué asistencia contratar? ¿Un viaje al año? ¿Anual 30/60/90 días?',detail:'La asistencia recomendada es la que más se adecúe a las necesidades del viajero.<p>“Un viaje al año” aplica a un viaje con días de corrido que tengan una fecha de inicio y de fin, partiendo de 1 día hasta 365.</p><p>Las productos multiviajes de 30, 60 y 90 tienen una vigencia de 365 días corridos en total y disponen de la cantidad de días contratados (30, 60 ó 90) a utilizar en diferentes períodos dentro de ese año. El beneficiario no podrá permanecer 30, 60 o 90 días corridos en el exterior por viaje o perderá todo beneficio de los servicios de asistencia contratados mientras esté en ese viaje.</p>'},
        {cod:'6', title: '¿Es posible contratar un seguro de viaje si ya inicié mi viaje?',detail:'No es posible contratar luego de que el viaje haya iniciado. En caso de hacerlo y solicitar cobertura, la misma será negada por emitirse de forma inválida.'},
        {cod:'7', title: '¿Por qué contratar un seguro de viaje?',detail:'Cada vez viajamos con más frecuencia y durante más tiempo, dentro de nuestro país o al extranjero, a lugares lejanos, exóticos... Viajar supone desconectar, disfrutar, olvidarse de la rutina, y todo esto puede venirse abajo por culpa de un pequeño contratiempo (no llega nuestro equipaje o nos hemos dejado un medicamento en casa, por ejemplo). Europ Assistance se ocupa de que cualquier imprevisto que pueda surgir en el transcurso de tu viaje. Por ello, y con el fin de ayudarte a conseguir que tu viaje sea un éxito, ponemos a tu disposición una amplia gama de productos con la que podrás elegir el que más se adapte a tus necesidades. Desde viajes en coche, autobús, barco o avión, de tan sólo dos días o hasta el límite de días que tengas disponibles, con asistencia legal y en carretera, pudiendo resolver tus problemas en caso de pérdida de equipaje, hospitalización, cita médica… y controlando tus gastos médicos dentro del límite contratado. Europ Assistance asegura tus vacaciones y te proporciona la tranquilidad y seguridad de estar respaldado por una compañía con presencia en todo el mundo.'},
        {cod:'8', title: '¿Qué facilidades ofrece Europ Assistance?',detail:'<ul class="list-disc ml-4"><li>410.000 colaboradores registrados en 208 países. </li><li>Una red capaz de prestar 1 asistencia cada 2 segundos en todo el mundo. </li><li>Una red capaz de prestar 1 asistencia cada 2 segundos en todo el mundo. </li><li>400 profesionales sanitarios. </li><li>Material sanitario de última generación.</li></ul>'}
      ];

      useEffect(() => {
        if(!Cookie.get('location')){
            router.replace('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    
    return ( 
        // <AppLayout>
            <>
            <Banner banner='preguntas-frecuentes'/>
            <section className='w-full '>
                <FaqItem preguntasFaq={preguntasFaq} />
            </section>
            </>
       // </AppLayout>
    )
}

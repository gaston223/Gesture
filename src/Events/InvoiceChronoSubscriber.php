<?php

namespace App\Events;

use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubscriber implements EventSubscriberInterface {


    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event){
        //dd($this->repository->findNextChrono($this->security->getUser()));

        //1.Je récupère l'utilisateur connecté (Security)

        //2. Je récupère le repository des invoices

        //3. Je récupère la dernière facture qui a été inséree, et reupérer son chrono

        //4. Dans cette nouvelle facture, on donne le dernier chrono +1

        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        if($invoice instanceof Invoice && $method ==="POST"){

            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            $invoice->setChrono($nextChrono);   

            // TODO A deplacer dans une classe dédiée
            if(empty($invoice->getSentAt())){
                $invoice->setSentAt(new \DateTime());
            }

        }
    }

}
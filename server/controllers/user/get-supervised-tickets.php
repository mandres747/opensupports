<?php
use Respect\Validation\Validator as DataValidator;
	
/**
* @api {post} /user/get-supervised-tickets Get supervised tickets
* @apiVersion 4.8.0
*
* @apiName Get supervised tickets
*
* @apiGroup User
*
* @apiDescription This path retrieves own and user supervisated tickets.
*
* @apiPermission user
*
* @apiParam {id[]} supervisedUsers arrays of users Ids.
* @apiParam {boolean} showOwnTickets boolean to show or not own tickets.
* @apiParam {Number} page The number of the page of the tickets.
*
* @apiUse NO_PERMISSION
* @apiUse INVALID_SUPERVISED_USERS
*
* @apiSuccess {Object} data Information about a tickets and quantity of pages.
* @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets assigned to the staff of the current page.
* @apiSuccess {Number} data.page Number of current page.
* @apiSuccess {Number} data.pages Quantity of pages.
*
*/

class GetSupervisedTicketController extends Controller {
    const PATH = '/get-supervised-tickets';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'supervisedUsers' => [
                    'validation' => DataValidator::oneOf(DataValidator::validSupervisedUsers(),DataValidator::nullType()),
                    'error' => ERRORS:: INVALID_SUPERVISED_USERS
                ],
                'page' => [
                    'validation' => DataValidator::oneOf(DataValidator::numeric()->positive(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_PAGE
                ]
            ]
        ];
    }
    private $authors;
    private $page;
    private $showOwnTickets;
    private $supervisedUserList;

    public function handler() {
        $this->page = Controller::request('page') ? Controller::request('page') : 1;
        $this->showOwnTickets = Controller::request('showOwnTickets') ? true : false;
        $this->supervisedUserList = Controller::request('supervisedUsers')?  json_decode(Controller::request('supervisedUsers')) : []; 
        $this->authors = $this->createAuthorsArray();
        
        if(!$this->shouldUserHandleSupervisedUsers()){
            throw new Exception(ERRORS::INVALID_SUPERVISED_USERS);
        }
        
        $searchController = new SearchController(true);
        Controller::setDataRequester(function ($key) {
            switch ($key) {
                case 'authors':
                    return json_encode($this->authors);
                case 'page' : 
                    return $this->page*1;
                case 'supervisor':
                    return 1;
            }

            return null;
        });
        
        if(empty($this->authors)) {
            Response::respondSuccess([]);
        }else{
            $searchController->handler();
        }        
    }
    
    public function  shouldUserHandleSupervisedUsers() {
        $user = Controller::getLoggedUser();
        
        if(!empty($this->supervisedUserList)){
            
            if($user->supervisedrelation) return false;
            
                foreach($this->supervisedUserList as $supevisedUser) {
                    if(!$user->supervisedrelation->sharedUserList->includesId($supevisedUser) && $supevisedUser != $user->id){
                        return false; 
                    }
                } 
        }
        return true;
    }

    public function createAuthorsArray(){
        $user = Controller::getLoggedUser();
        
        $authors = [];
        
        if(!empty($this->supervisedUserList)){
            foreach(array_unique($this->supervisedUserList) as $supervised){ 
                array_push($authors,['id'=> $supervised,'isStaff'=> 0]);
            }
        };
        
        if(!in_array( $user->id, $this->supervisedUserList) && $this->showOwnTickets){
            array_push($authors,['id'=> $user->id*1,'isStaff'=> 0]);
        }
        return $authors;
    }
}
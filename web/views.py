from django.http import HttpResponse
from django.shortcuts import render_to_response
from web.models import Party
from twilio.rest import TwilioRestClient
from django.views.decorators.csrf import csrf_exempt  


def serialize(party):
	
	strings = [] 
	strings.append( '"id":'+str(party.pk) )
	strings.append( '"name":'+'"'+party.name +'"' )
	strings.append( '"size":'+str(party.size) )
	strings.append( '"number":'+str(party.number) )
	strings.append( '"status":"'+str(party.status)+'"' )
	return '{'+', '.join(strings)+'}'	

def index (request):
	return render_to_response("web/index.html")

@csrf_exempt 	
def detail (request, party_id=None):
	if request.method == 'GET':
		party = Party.objects.get(pk=party_id)
		return HttpResponse(serialize(party))
	elif request.method == 'POST':
		p = Party ( name = request.POST['name'], size = request.POST['size'], number = request.POST['number'], status='w')
		p.save()
		return HttpResponse( p.pk )
	elif request.method == 'DELETE':
		print "this is a delete request!"
		return HttpResponse( "success!" )
		
def parties (request):
	if request.method == 'GET':
		party_list = Party.objects.all()
		json = "["+ ','.join(map ( serialize, party_list)) + "]"
		return HttpResponse(json)
		
@csrf_exempt 		
def sms(request):
	account_sid = "ACbd4d8320445ee24013362d44cbb6b4b0"
	auth_token = "2c829ea191dbd72e5341ba2a2c921655"
	client = TwilioRestClient(account_sid, auth_token)
	
	if request.method == "POST":
		party = Party.objects.get(pk=request.POST['id'])
		party.status = 'm'
		party.save()
		number = "+1"+str(party.number)
		name = party.name
		message = name+", your table is ready!"
		response = client.sms.messages.create(from_="+19515304400", to=number, body=message)
		return HttpResponse("success!")
		
	if request.method == "GET":
		return HttpResponse("{sid:"+account_sid+", auth_token:"+auth_token+"}")
		
@csrf_exempt 		
def seat(request):
	if request.method == "POST":
		party = Party.objects.get(pk=request.POST['id'])
		party.status = 's'
		party.save()
		return HttpResponse("success!")

from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',

	url(r'^admin/', include(admin.site.urls)),
	
	url(r'^$', 'web.views.index'),
	url(r'^party/$', 'web.views.detail'),
	url(r'^party/(?P<party_id>\d+)/$', 'web.views.detail'),
	url(r'^parties/$', 'web.views.parties'),
	url(r'^sms/$', 'web.views.sms'),
	url(r'^seat/$', 'web.views.seat'),


)

from django.contrib.auth.views import LogoutView
from django.urls import path

from . import views

app_name = 'gestionale'

urlpatterns = [
    # Auth
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='gestionale:login'), name='logout'),

    # Dashboard
    path('', views.DashboardView.as_view(), name='dashboard'),

    # Corsi
    path('corsi/', views.CorsoListView.as_view(), name='corso_list'),
    path('corsi/nuovo/', views.CorsoCreateView.as_view(), name='corso_create'),
    path('corsi/<int:pk>/', views.CorsoDetailView.as_view(), name='corso_detail'),
    path('corsi/<int:pk>/modifica/', views.CorsoUpdateView.as_view(), name='corso_update'),
    path('corsi/<int:pk>/elimina/', views.CorsoDeleteView.as_view(), name='corso_delete'),

    # Dipendenti
    path('dipendenti/', views.DipendenteListView.as_view(), name='dipendente_list'),
    path('dipendenti/nuovo/', views.DipendenteCreateView.as_view(), name='dipendente_create'),
    path('dipendenti/<int:pk>/', views.DipendenteDetailView.as_view(), name='dipendente_detail'),
    path('dipendenti/<int:pk>/modifica/', views.DipendenteUpdateView.as_view(), name='dipendente_update'),

    # Assegnazioni
    path('assegnazioni/', views.AssegnazioneListView.as_view(), name='assegnazione_list'),
    path('assegnazioni/nuova/', views.AssegnazioneCreateView.as_view(), name='assegnazione_create'),
    path('assegnazioni/<int:pk>/modifica/', views.AssegnazioneUpdateView.as_view(), name='assegnazione_update'),
    path('assegnazioni/<int:pk>/elimina/', views.AssegnazioneDeleteView.as_view(), name='assegnazione_delete'),
    path('assegnazioni/<int:pk>/certificato/', views.CertificatoUploadView.as_view(), name='certificato_upload'),
    path('assegnazioni/<int:pk>/certificato/elimina/', views.CertificatoDeleteView.as_view(), name='certificato_delete'),

    # Materiali corso
    path('corsi/<int:pk>/materiali/', views.MaterialeCorsoUploadView.as_view(), name='materiale_upload'),
    path('corsi/materiali/<int:pk>/elimina/', views.MaterialeCorsoDeleteView.as_view(), name='materiale_delete'),

    # Export
    path('export/excel/', views.ExportExcelView.as_view(), name='export_excel'),

    # API JSON (usate dai test e da client esterni)
    path('api/corsi/', views.ApiCorsoCreateView.as_view(), name='api_corso_create'),
    path('api/assegnazioni/', views.ApiAssegnazioneCreateView.as_view(), name='api_assegnazione_create'),
    path('api/assegnazioni/<int:pk>/certificato/', views.ApiCertificatoUploadView.as_view(), name='api_certificato_upload'),
    path('api/auth/login/', views.ApiLoginView.as_view(), name='api_login'),
]

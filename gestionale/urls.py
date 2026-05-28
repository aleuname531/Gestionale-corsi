from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),

    # auth
    path('api/auth/me/', views.api_auth_me, name='api_auth_me'),
    path('api/auth/login/', views.api_auth_login, name='api_auth_login'),
    path('api/auth/logout/', views.api_auth_logout, name='api_auth_logout'),

    # init
    path('api/init/', views.api_init, name='api_init'),

    # corsi
    path('api/corsi/', views.api_corsi, name='api_corsi'),
    path('api/corsi/<int:pk>/', views.api_corso_detail, name='api_corso_detail'),

    # dipendenti
    path('api/dipendenti/', views.api_dipendenti, name='api_dipendenti'),
    path('api/dipendenti/<int:pk>/', views.api_dipendente_detail, name='api_dipendente_detail'),

    # assegnazioni
    path('api/assegnazioni/', views.api_assegnazioni, name='api_assegnazioni'),
    path('api/assegnazioni/<int:pk>/', views.api_assegnazione_detail, name='api_assegnazione_detail'),
    path('api/assegnazioni/<int:pk>/certificato/', views.api_certificato, name='api_certificato'),
]

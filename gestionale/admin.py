from django.contrib import admin

from .models import AssegnazioneCorso, Corso, Dipendente, MaterialeCorso, Vendor


class MaterialeCorsoInline(admin.TabularInline):
    model = MaterialeCorso
    extra = 0
    fields = ('titolo', 'file', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'sito_web', 'contatto_email')
    search_fields = ('nome', 'contatto_email')


@admin.register(Corso)
class CorsoAdmin(admin.ModelAdmin):
    list_display = ('titolo', 'vendor', 'tipologia', 'durata_ore', 'validita_mesi', 'obbligatorio')
    list_filter = ('tipologia', 'vendor', 'obbligatorio')
    search_fields = ('titolo', 'descrizione', 'vendor__nome')
    inlines = [MaterialeCorsoInline]


@admin.register(Dipendente)
class DipendenteAdmin(admin.ModelAdmin):
    list_display = ('cognome', 'nome', 'email', 'reparto', 'attivo')
    list_filter = ('reparto', 'attivo')
    search_fields = ('nome', 'cognome', 'email', 'reparto')


@admin.register(AssegnazioneCorso)
class AssegnazioneCorsoAdmin(admin.ModelAdmin):
    list_display = ('dipendente', 'corso', 'stato', 'data_assegnazione', 'data_completamento', 'data_scadenza')
    list_filter = ('stato', 'corso__tipologia', 'corso__vendor')
    search_fields = ('dipendente__nome', 'dipendente__cognome', 'dipendente__email', 'corso__titolo')
    autocomplete_fields = ('dipendente', 'corso')
    date_hierarchy = 'data_scadenza'

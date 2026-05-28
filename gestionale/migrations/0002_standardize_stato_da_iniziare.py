from django.db import migrations, models


def forwards(apps, schema_editor):
    AssegnazioneCorso = apps.get_model('gestionale', 'AssegnazioneCorso')
    AssegnazioneCorso.objects.filter(stato='da_completare').update(stato='da_iniziare')


def backwards(apps, schema_editor):
    AssegnazioneCorso = apps.get_model('gestionale', 'AssegnazioneCorso')
    AssegnazioneCorso.objects.filter(stato='da_iniziare').update(stato='da_completare')


class Migration(migrations.Migration):

    dependencies = [
        ('gestionale', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
        migrations.AlterField(
            model_name='assegnazionecorso',
            name='stato',
            field=models.CharField(
                choices=[
                    ('da_iniziare', 'Da iniziare'),
                    ('in_corso', 'In corso'),
                    ('completato', 'Completato'),
                    ('scaduto', 'Scaduto'),
                ],
                default='da_iniziare',
                max_length=20,
            ),
        ),
    ]

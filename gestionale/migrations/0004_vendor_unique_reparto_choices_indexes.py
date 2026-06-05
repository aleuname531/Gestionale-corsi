from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestionale', '0003_corso_tipologia'),
    ]

    operations = [
        # M5: Vendor.nome unique — prevents duplicate vendors from admin panel
        migrations.AlterField(
            model_name='vendor',
            name='nome',
            field=models.CharField(max_length=200, unique=True),
        ),

        # D9/M7: Dipendente.reparto — structured choices + index for list_filter performance
        migrations.AlterField(
            model_name='dipendente',
            name='reparto',
            field=models.CharField(
                blank=True,
                choices=[
                    ('IT', 'IT'),
                    ('HR', 'HR'),
                    ('PM', 'PM'),
                    ('RPA', 'RPA'),
                    ('Finance', 'Finance'),
                    ('Sales', 'Sales'),
                    ('Operations', 'Operations'),
                    ('Altro', 'Altro'),
                ],
                db_index=True,
                max_length=100,
            ),
        ),

        # M6: AssegnazioneCorso.stato — index for frequent filtering by status
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
                db_index=True,
                default='da_iniziare',
                max_length=20,
            ),
        ),
    ]

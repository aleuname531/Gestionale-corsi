from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestionale', '0002_standardize_stato_da_iniziare'),
    ]

    operations = [
        migrations.AddField(
            model_name='corso',
            name='tipologia',
            field=models.CharField(
                choices=[
                    ('Tecnico', 'Tecnico'),
                    ('Management', 'Management'),
                    ('Cloud', 'Cloud'),
                    ('Analytics', 'Analytics'),
                    ('Compliance', 'Compliance'),
                    ('Soft Skills', 'Soft Skills'),
                    ('Sicurezza', 'Sicurezza'),
                    ('Altro', 'Altro'),
                ],
                default='Altro',
                max_length=50,
            ),
        ),
    ]

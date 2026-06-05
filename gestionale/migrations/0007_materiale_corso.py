from django.db import migrations, models
import django.db.models.deletion
import gestionale.models


class Migration(migrations.Migration):

    dependencies = [
        ('gestionale', '0006_dipendente_stipendio'),
    ]

    operations = [
        migrations.CreateModel(
            name='MaterialeCorso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titolo', models.CharField(max_length=200)),
                ('file', models.FileField(upload_to=gestionale.models._materiale_upload_path)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('corso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='materiali', to='gestionale.corso')),
            ],
            options={
                'verbose_name': 'Materiale Corso',
                'verbose_name_plural': 'Materiali Corso',
                'ordering': ['titolo'],
            },
        ),
    ]

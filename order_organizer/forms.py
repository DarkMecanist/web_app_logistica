from django import forms
from .models import Order, Part, Shipping


class CreateOrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['client', 'doc_type', 'order_num_doc', 'associated_doc_type', 'order_num_associated_doc', 'due_date', 'notes']
        labels = {'client': 'Cliente',
                  'doc_type': 'Tipo de Documento (EPROD / ENCOM)',
                  'order_num_doc': 'Nº Documento',
                  'associated_doc_type': 'Tipo de Documento Associado (EPROD / ENCOM)',
                  'order_num_associated_doc': 'Nº Documento Associado',
                  'due_date': 'Data de Entrega',
                  'notes': 'Notas'}


class CreatePartForm(forms.ModelForm):
    class Meta:
        model = Part
        fields = ['storage', 'reference', 'name', 'stock_quantity', 'stock_unit', 'material', 'weight', 'technical_PDF']


class CreateShippingForm(forms.ModelForm):
    class Meta:
        model = Shipping
        fields = ['client', 'doc_type', 'num_doc', 'associated_doc_type', 'order_num_associated_doc', 'vehicle_info', 'total_weight', 'notes']
        # labels = {'client': 'Cliente:',
        #           'doc_type': 'Tipo de Documento:',
        #           'order_num_doc': 'Nº Documento:',
        #           'associated_doc_type': 'Tipo de Encomenda:',
        #           'order_num_associated_doc': 'Nº Encomenda:',
        #           'vehicle_info': 'Informação Veículo:',
        #           'total_weight': 'Peso Total:',
        #           'notes': 'Notas:'}


class UploadFileForm(forms.Form):
    docfile = forms.FileField(label='Selecione o PDF')


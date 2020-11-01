from django.shortcuts import redirect
from django.http import JsonResponse
from django.views.generic import ListView, CreateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Order, Shipping, Part
from background_task.models import Task, CompletedTask
from .forms import CreateOrderForm
from django.core.files import File
from .tasks import generate_dict_order_info, generate_order_tags_document, generate_order_lists_document, convert_objects_to_lists, generate_parts_list_document, generate_shippings_list_document
from django.core.files.storage import default_storage
from random import randint
import subprocess
import datetime


#RESOLUÇAO = 1280px

# TODO implement confirmation modals when deleting parts on updating menus (DONE, CONFIRM iF WORKS)
# TODO implement loading while deleting parts in stocks page
# TODO make sure to set default values for non required form fields like 0 for number or N/A for text
# TODO Fix error of quantities being multiplied by 10 when generating word list and tags


def reset_db_orders():
    file_1 = default_storage.open('encomendas_exemplo/ENCL 220_457.pdf')
    file_2 = default_storage.open('encomendas_exemplo/ENCL 220_457_2.pdf')
    file_3 = default_storage.open('encomendas_exemplo/ENCL 220_457_3.pdf')

    for order in Order.objects.all():
        default_storage.delete(str(order.pdf_file_path))
        order.delete()

    # Generate generic orders
    for index in range(3):
        print(f'index == {index}')
        if index == 0:
            order_info = {
                'client': 'Consumidor Final (2)',
                'doc_type': 'ENCOM',
                'order_num_doc': '220/457',
                'associated_doc_type': '',
                'order_num_associated_doc': '',
                'notes': '',
                'due_date': datetime.datetime(2020, 9, 24, 0, 0),
                'date_inserted': datetime.datetime.now(),
                'pdf_file_path': file_2,
                'parts_string': '4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 1|?!|111,0|?!|111,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 10|?!|98,0|?!|98,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 11|?!|100,0|?!|100,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 12|?!|66,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 13|?!|2,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 14|?!|4,0|?!|4,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 15|?!|79,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAOLASER - PEÇA EXEMPLO 16|?!|47,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 17|?!|34,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 18|?!|150,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 19|?!|300,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 2|?!|3300,0|?!|3300,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 20|?!|1500,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 21|?!|2,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 22|?!|7,0|?!|7,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 3|?!|1000,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 4|?!|1365,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 5|?!|897,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 6|?!|22,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 7|?!|789,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 8|?!|777,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 9|?!|125,0|?!|0|?!|0|?!|UN|?!|/?_!/'
            }
        elif index == 1:
            order_info = {
                'client': 'Consumidor Final (3)',
                'doc_type': 'ENCOM',
                'order_num_doc': '220/457',
                'associated_doc_type': '',
                'order_num_associated_doc': '',
                'notes': 'sem notas a apresentar',
                'due_date': datetime.datetime(2020, 9, 24, 0, 0),
                'date_inserted': datetime.datetime.now(),
                'pdf_file_path': file_3,
                'parts_string': '4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 1|?!|22,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 10|?!|736,0|?!|736,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 11|?!|223,0|?!|223,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 12|?!|220,0|?!|220,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 13|?!|67,0|?!|67,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 14|?!|723,0|?!|723,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 15|?!|465,0|?!|465,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 16|?!|489,0|?!|489,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 2|?!|100,0|?!|100,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 3|?!|699,0|?!|699,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 4|?!|400,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 5|?!|3,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 6|?!|79,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 7|?!|1,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 8|?!|469,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 9|?!|1235,0|?!|0|?!|0|?!|UN|?!|/?_!/'
            }
        else:
            order_info = {
                'client': 'Consumidor Final (1)',
                'doc_type': 'ENCOM',
                'order_num_doc': '220/457',
                'associated_doc_type': '',
                'order_num_associated_doc': '',
                'notes': '',
                'due_date': datetime.datetime(2020, 9, 24, 0, 0),
                'date_inserted': datetime.datetime.now(),
                'pdf_file_path': file_1,
                'parts_string': '4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 1|?!|10,0|?!|10,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 10|?!|78,0|?!|78,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 11|?!|98,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 12|?!|35,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 13|?!|47,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 14|?!|68,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 15|?!|126,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 16|?!|444,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 17|?!|987,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 18|?!|482,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 19|?!|788,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 2|?!|20,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 20|?!|123,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 21|?!|111,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 22|?!|100,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 23|?!|124,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 24|?!|177,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 25|?!|555,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 26|?!|666,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 27|?!|879,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 28|?!|1245,0|?!|1245|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 29|?!|1,0|?!|1,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 3|?!|50,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 30|?!|11,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 4|?!|66,0|?!|0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 5|?!|22,0|?!|22,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 6|?!|356,0|?!|356,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 7|?!|23,0|?!|23,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 8|?!|12,0|?!|12,0|?!|0|?!|UN|?!|/?_!/4|?!|130400B00000|?!|C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO 9|?!|48,0|?!|48,0|?!|0|?!|UN|?!|/?_!/'
            }

        new_order = Order(client=order_info['client'], doc_type=order_info['doc_type'], order_num_doc=order_info['order_num_doc'],
                          associated_doc_type=order_info['associated_doc_type'],
                          order_num_associated_doc=order_info['order_num_associated_doc'], date_inserted=order_info['date_inserted'],
                          due_date=order_info['due_date'],
                          notes=order_info['notes'], pdf_file_path=order_info['pdf_file_path'], parts_string=order_info['parts_string'])
        new_order.save()


def reset_db_shippings():
    for shipping in Shipping.objects.all():
        shipping.delete()


def reset_db_parts():
    for part in Part.objects.all():
        try:
            default_storage.delete(str(part.technical_PDF))
        except:
            pass
        part.delete()

    materials = [f'Ferro {i}' for i in range(1,10)] + [f'Inox {i}' for i in range(1,6)] + [f'Alumínio {i}' for i in range(1,6)]
    technical_PDF_file = default_storage.open('fichas_técnicas_artigos/Example_Technical_PDF.pdf')
    # Generate generic parts
    for index in range(15):
        part_info = {
            'storage': '4',
            'reference': '130400B00000',
            'name': f'C 9000-ARTIGO DE PRODUCAO LASER - PEÇA EXEMPLO {index + 1}',
            'stock_quantity': str(randint(1, 200)),
            'stock_unit': 'UN.',
            'material': materials[randint(0, len(materials)-1)],
            'weight': f'{randint(1,2)}.{randint(0,9)}',
            'technical_PDF': technical_PDF_file
        }

        new_part = Part(storage=part_info['storage'], reference=part_info['reference'], name=part_info['name'], stock_quantity=part_info['stock_quantity'],
                        stock_unit=part_info['stock_unit'], material=part_info['material'], weight=part_info['weight'], technical_PDF=part_info['technical_PDF'])

        new_part.save()


def reset_db_tasks():
    for task in Task.objects.all():
        task.delete()


class OrdersPage(LoginRequiredMixin, ListView):
    title = 'Encomendas'
    model = Order
    template_name = 'order_organizer/orders_page.html'
    context_object_name = 'orders'
    ordering = ['-date_inserted']

    def post(self, request, *args, **kwargs):

        if self.request.method == 'POST':

            # GENERATE NEW ORDER FROM PDF
            if 'upload-file' in request.POST:
                uploaded_file = request.FILES['file-name']

                with open(str(uploaded_file), 'wb+') as destination:
                    for chunk in uploaded_file.chunks():
                        destination.write(chunk)

                # path = default_storage.save('pdfs_encomendas/' + uploaded_file.name, ContentFile(uploaded_file.read()))

                order_info = generate_dict_order_info(str(uploaded_file))

                new_file = File(file=uploaded_file)
                order = Order(client=order_info['client'], doc_type=order_info['order_type'], order_num_doc=order_info['order_num'],
                              associated_doc_type='N/A', order_num_associated_doc='N/A', date_inserted=order_info['date_inserted'],
                              due_date=order_info['due_date'], notes='N/A', pdf_file_path=new_file, parts_string=order_info['parts_string'])

                order.save()

                # default_storage.delete('pdfs_encomendas/' + uploaded_file.name)

            # GENERATE DOC TAGS OR DOC LISTS
            elif 'output' in request.POST:

                if request.POST.get('output') == 'tags':
                    id_selected_orders = request.POST.get('id_selected_orders').split(',')
                    list_selected_orders = convert_objects_to_lists(([Order.objects.get(pk=order_id) for order_id in id_selected_orders]), 'order')

                    subprocess.Popen('python manage.py process_tasks', shell=True)
                    generate_order_tags_document(list_selected_orders)

                    return JsonResponse({"status": "unfinished"}, status=200)

                elif request.POST.get('output') == 'lists':

                    id_selected_orders = request.POST.get('id_selected_orders').split(',')
                    list_selected_orders = convert_objects_to_lists(([Order.objects.get(pk=order_id) for order_id in id_selected_orders]), 'order')

                    subprocess.Popen('python manage.py process_tasks', shell=True)
                    generate_order_lists_document(list_selected_orders)

                    return JsonResponse({"status": "unfinished"}, status=200)

                elif request.POST.get('output') == 'check_response_ready':

                    if len(Task.objects.all()) == 0:
                        for c_task in CompletedTask.objects.all():
                            c_task.delete()
                        return JsonResponse({"status": "finished"}, status=200)
                    else:
                        return JsonResponse({"status": "unfinished"}, status=200)

                else:
                    for order_id in request.POST.get('id_selected_orders').split(','):
                        order = Order.objects.get(pk=order_id)
                        default_storage.delete(str(order.pdf_file_path))
                        order.delete()

                    return JsonResponse({'redirect': ''}, status=200)

            elif 'reset_db' in request.POST:
                reset_db_orders()
                reset_db_shippings()
                reset_db_parts()
                reset_db_tasks()

                return JsonResponse({'redirect': ''}, status=200)

            else:
                if request.POST.get('ordenar') == 'cliente':
                    OrdersPage.ordering = ['client']
                elif request.POST.get('ordenar') == 'data-entrega':
                    OrdersPage.ordering = ['due_date']
                elif request.POST.get('ordenar') == 'data-introdução':
                    OrdersPage.ordering = ['-date_inserted']
            return redirect('orders_page')


class OrderCreateView(LoginRequiredMixin, CreateView):
    model = Order
    fields = ['client', 'doc_type', 'order_num_doc', 'associated_doc_type', 'order_num_associated_doc', 'due_date', 'notes']
    template_name = 'order_organizer/create_order.html'

    def post(self, request, *args, **kwargs):
        form = CreateOrderForm(request.POST, auto_id='id_for_%s')

        # date_string = request.POST.get('due_date') APAGAR?

        if form.is_valid():
            order = form.save(commit=False)

            order.client = request.POST.get('client')
            order.doc_type = request.POST.get('doc_type')
            order.order_num_doc = request.POST.get('order_num_doc')
            order.associated_doc_type = request.POST.get('associated_doc_type')
            order.order_num_associated_doc = request.POST.get('order_num_associated_doc')
            order.due_date = request.POST.get('due_date')
            order.notes = request.POST.get('notes')
            order.parts_string = request.POST.get('parts_string')

            order.save()
        else:
            print('POST WAS INVALID!: CHECK ERRORS BELOW')
            print(form.errors)

        return redirect('orders_page')


class OrderUpdateView(LoginRequiredMixin, UpdateView):
    model = Order
    fields = ['client', 'doc_type', 'order_num_doc', 'associated_doc_type', 'order_num_associated_doc', 'due_date', 'notes']
    template_name = 'order_organizer/update_order.html'

    # TODO test if a different user can update an order created by another
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

    def post(self, request, *args, **kwargs):
        if request.POST.get('request_type') == 'request_weight':
            response_list = []

            for index in range(int(len(request.POST)/6)):
                part_info = {}
                part_storage = request.POST.get(f'request_weight[{index}][storage]')
                part_ref = request.POST.get(f'request_weight[{index}][reference]')
                part_name = request.POST.get(f'request_weight[{index}][name]')
                part_pending_quantity = request.POST.get(f'request_weight[{index}][pending_quantity]')
                part_ready_quantity = request.POST.get(f'request_weight[{index}][ready_quantity]')
                unit = request.POST.get(f'request_weight[{index}][unit]')

                try:
                    if part_ref == '1':
                        part_list = Part.objects.filter(reference=part_ref)

                        for part in part_list:
                            if part.name == part_name:
                                part_weight = part.weight
                                part_stock_quantity = part.stock_quantity
                    else:
                        part = Part.objects.get(reference=part_ref)
                        part_weight = part.weight
                        part_stock_quantity = part.stock_quantity
                except:
                    part_weight = 'N/A'
                    part_stock_quantity = 'N/A'

                part_info.update({'storage': part_storage, 'reference': part_ref, 'name': part_name, 'pending_quantity': part_pending_quantity,
                                'ready_quantity': part_ready_quantity, 'stock_quantity': part_stock_quantity, 'unit': unit, 'weight': part_weight})

                response_list.append(part_info)

            return JsonResponse({'updated_list': response_list})

        elif request.POST.get('request_type') == 'create_shipping':
            client = request.POST.get('client')
            doc_type = request.POST.get('doc_type')
            num_doc = request.POST.get('num_doc')
            associated_doc_type = request.POST.get('associated_doc_type')
            order_num_associated_doc = request.POST.get('order_num_associated_doc')
            vehicle_info = request.POST.get('vehicle_info')
            total_weight = request.POST.get('total_weight')
            parts_string = request.POST.get('parts_string')

            shipping = Shipping(client=client, doc_type=doc_type, num_doc=num_doc, associated_doc_type=associated_doc_type,
                                order_num_associated_doc=order_num_associated_doc, vehicle_info=vehicle_info, total_weight=total_weight,
                                parts_string=parts_string, delete_order_parts=True)

            shipping.save()
            # TODO DELETE PARTS FROM ORDER, AFTER SHIPPING IS GENERATED THIS SHOULD BE DONE IN A MODEL METHOD

            return JsonResponse({'redirect': 'shippings'})

        else:
            form = CreateOrderForm(request.POST, auto_id='id_for_%s')

            if form.is_valid():

                order_id = request.POST.get('pk')

                order = Order.objects.get(pk=order_id)

                order.client = request.POST.get('client')
                order.doc_type = request.POST.get('doc_type')
                order.order_num_doc = request.POST.get('order_num_doc')
                order.associated_doc_type = request.POST.get('associated_doc_type')
                order.order_num_associated_doc = request.POST.get('order_num_associated_doc')
                order.due_date = request.POST.get('due_date')
                order.notes = request.POST.get('notes')
                order.parts_string = request.POST.get('parts_string')

                order.save()

                print('SUCCESSFULLY UPDATED ORDER INFO')
                print(order.parts_list)

                return redirect('orders_page')

            else:
                return redirect('orders_page')


class ShippingsPage(LoginRequiredMixin, ListView):
    title = 'Exportações'
    model = Shipping
    template_name = 'order_organizer/shippings_page.html'
    context_object_name = 'shippings'
    ordering = ['-date_inserted']

    def post(self, request, *args, **kwargs):
        if self.request.method == 'POST':
            if request.POST.get('output') == 'delete':
                for shipping_id in request.POST.get('id_selected_shippings').split(','):
                    shipping = Shipping.objects.get(pk=shipping_id)
                    shipping.delete()

            elif request.POST.get('output') == 'list':

                id_selected_shippings = request.POST.get('id_selected_shippings').split(',')
                list_selected_shippings = convert_objects_to_lists((Shipping.objects.get(pk=shipping_id) for shipping_id in id_selected_shippings), 'shipping')

                subprocess.Popen('python manage.py process_tasks', shell=True)
                generate_shippings_list_document(list_selected_shippings)

            elif request.POST.get('output') == 'check_response_ready':

                if len(Task.objects.all()) == 0:
                    for c_task in CompletedTask.objects.all():
                        c_task.delete()
                    return JsonResponse({"status": "finished"}, status=200)
                else:
                    return JsonResponse({"status": "unfinished"}, status=200)

            else:
                if request.POST.get('ordenar') == 'cliente':
                    ShippingsPage.ordering = ['client']
                elif request.POST.get('ordenar') == 'data-introdução':
                    ShippingsPage.ordering = ['-date_inserted']

                return redirect('shippings_page')

        return JsonResponse({'redirect': '/expedicoes/'}, status=200)


class ShippingCreateView(LoginRequiredMixin, CreateView):
    model = Shipping
    fields = ['client', 'doc_type', 'num_doc', 'associated_doc_type', 'order_num_associated_doc', 'vehicle_info', 'total_weight', 'notes']
    template_name = 'order_organizer/create_shipping.html'

    def post(self, request, *args, **kwargs):
        new_shipping = Shipping()
        new_shipping.client = request.POST.get('client')
        new_shipping.doc_type = request.POST.get('doc_type')
        new_shipping.num_doc = request.POST.get('num_doc')
        new_shipping.associated_doc_type = request.POST.get('associated_doc_type')
        new_shipping.order_num_associated_doc = request.POST.get('order_num_associated_doc')
        new_shipping.vehicle_info = request.POST.get('vehicle_info')
        new_shipping.notes = request.POST.get('notes')
        new_shipping.parts_string = request.POST.get('parts_string')

        new_shipping.save()

        return JsonResponse({'redirect': '/expedicoes/'}, status=200)


class ShippingUpdateView(LoginRequiredMixin, UpdateView):
    model = Shipping
    fields = ['client', 'doc_type', 'num_doc', 'associated_doc_type', 'order_num_associated_doc', 'vehicle_info', 'total_weight', 'notes']
    template_name = 'order_organizer/update_shipping.html'

    def post(self, request, *args, **kwargs):
        pk = request.build_absolute_uri().split('/')[4]

        shipping = Shipping.objects.get(pk=pk)
        shipping.client = request.POST.get('client')
        shipping.doc_type = request.POST.get('doc_type')
        shipping.num_doc = request.POST.get('num_doc')
        shipping.associated_doc_type = request.POST.get('associated_doc_type')
        shipping.order_num_associated_doc = request.POST.get('order_num_associated_doc')
        shipping.vehicle_info = request.POST.get('vehicle_info')
        shipping.total_weight = request.POST.get('total_weight') + ' kg'
        shipping.notes = request.POST.get('notes')
        shipping.parts_string = request.POST.get('parts_string')

        shipping.save()

        return JsonResponse({'redirect': '/expedicoes/'}, status=200)


class PartsPage(LoginRequiredMixin, ListView):
    title = 'Parts'
    model = Part
    template_name = 'order_organizer/stocks_page.html'
    context_object_name = 'parts'
    ordering = ['name']

    def post(self, request, *args, **kwargs):
        if self.request.method == 'POST':
            if request.POST.get('output') == 'delete':
                for part_id in request.POST.get('id_selected_parts').split(','):
                    part = Part.objects.get(pk=part_id)

                    try:
                        default_storage.delete(str(part.technical_PDF))
                    except:
                        pass

                    part.delete()

            elif request.POST.get('output') == 'list':

                id_selected_parts = request.POST.get('id_selected_parts').split(',')
                list_selected_parts = convert_objects_to_lists((Part.objects.get(pk=part_id) for part_id in id_selected_parts), 'part')

                subprocess.Popen('python manage.py process_tasks', shell=True)
                generate_parts_list_document(list_selected_parts)

            elif request.POST.get('output') == 'check_response_ready':
                if len(Task.objects.all()) == 0:
                    for c_task in CompletedTask.objects.all():
                        c_task.delete()
                    return JsonResponse({"status": "finished"}, status=200)
                else:
                    return JsonResponse({"status": "unfinished"}, status=200)

            elif request.POST.get('output') == 'technical_sheet_url':
                print('RECEIVED REQUEST FOR TECHNICAL SHEET URL')
                technical_sheet_url = ''

                if request.POST.get('part_ref') == '1':
                    for part_obj in Part.objects.filter(reference=request.POST.get('part_ref')):
                        if request.POST.get('part_name') == part_obj.name:
                            technical_sheet_url = str(part_obj.technical_PDF)
                        else:
                            technical_sheet_url = 'No technical PDF'

                else:
                    try:
                        part_obj_by_ref = Part.objects.get(reference=request.POST.get('part_ref'))

                        technical_sheet_url = str(part_obj_by_ref.technical_PDF)
                    except:
                        technical_sheet_url = 'No technical PDF'

                return JsonResponse({'technical_sheet_url': technical_sheet_url}, status=200)

        return JsonResponse({'redirect': '/stocks/'}, status=200)


class PartCreateView(LoginRequiredMixin, CreateView):
    model = Part
    fields = ['storage', 'reference', 'name', 'stock_quantity', 'stock_unit', 'material', 'weight', 'technical_PDF']
    template_name = 'order_organizer/create_part_stock.html'

    def post(self, request, *args, **kwargs):

        new_part = Part()
        new_part.storage = request.POST.get('storage')
        new_part.reference = request.POST.get('reference')
        new_part.name = request.POST.get('name')
        new_part.stock_quantity = request.POST.get('stock_quantity')
        new_part.stock_unit = request.POST.get('stock_unit')
        new_part.material = request.POST.get('material')
        new_part.weight = request.POST.get('weight')

        if request.POST.get('technical_PDF') != '':
            uploaded_file = request.FILES['technical_PDF']

            new_part.technical_PDF = File(file=uploaded_file)

            # with open(str(uploaded_file), 'wb+') as destination:
            #     for chunk in uploaded_file.chunks:
            #         destination.write(chunk)
        else:
            new_part.technical_PDF = ''

        new_part.save()

        return JsonResponse({'redirect': '/stocks/'}, status=200)


class PartUpdateView(LoginRequiredMixin, UpdateView):
    model = Part
    fields = ['storage', 'reference', 'name', 'stock_quantity', 'stock_unit', 'material', 'weight', 'technical_PDF']
    template_name = 'order_organizer/update_part_stock.html'

    def post(self, request, *args, **kwargs):
        pk = request.build_absolute_uri().split('/')[4]

        print('RECEIVED REQUEST UPDATE PART')

        print(request.POST)

        part = Part.objects.get(pk=pk)
        part.storage = request.POST.get('storage')
        part.reference = request.POST.get('reference')
        part.name = request.POST.get('name')
        part.stock_quantity = request.POST.get('stock_quantity')
        part.stock_unit = request.POST.get('stock_unit')
        part.material = request.POST.get('material')
        part.weight = request.POST.get('weight')

        try:
            default_storage.delete(str(part.technical_PDF))
            part.technical_PDF = File(file=request.FILES['technical_PDF'])
        except:
            part.technical_PDF = File(file=request.FILES['technical_PDF'])

        part.save()

        return JsonResponse({'redirect': '/stocks/'}, status=200)


def test_func_button_press(request):
    if request.method == 'POST' and 'run_script' in request.POST:

        from .static.order_organizer.python_scripts import test_func

        test_func()

        return redirect('orders_page')


def selected_orders(request):
    for pk in request.GET.getlist('is_selected'):

        order = Order.objects.get(id=pk)

        try:
            default_storage.delete(str(order.pdf_file_path))
        except:
            pass

        order.delete()

    return redirect('orders_page')


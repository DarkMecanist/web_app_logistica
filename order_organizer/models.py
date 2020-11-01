from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.urls import reverse
from PIL import Image


class Order(models.Model):
    client = models.TextField(max_length=30)
    doc_type = models.TextField(max_length=8)
    order_num_doc = models.TextField(max_length=15)
    associated_doc_type = models.TextField(max_length=8)
    order_num_associated_doc = models.TextField(max_length=15)
    date_inserted = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField()
    notes = models.TextField()
    pdf_file_path = models.FileField(default=None, upload_to='pdfs_encomendas')
    parts_string = models.TextField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            self.parts_list = self.generate_parts_list_from_parts_string()
            # print(f'PARTS LIST = {self.parts_list}')
            self.num_total_parts = len(self.parts_list)
            self.num_completed_parts = self.get_num_parts_completed()
            self.percent_completed = self.calculate_completion()

            # if self.num_total_parts == 0:
            #     self.delete()
        except AttributeError:
            pass

    def __str__(self):
        return f'{self.doc_type}: {self.order_num_doc}, do cliente {self.client}, com data de entrega no dia {self.due_date}'

    def get_absolute_url(self):
        return reverse('orders_page', kwargs={'pk': self.pk})

    def generate_parts_list_from_parts_string(self):
        parts_list = [elem.split('|?!|') for elem in self.parts_string.split('/?_!/')]
        del parts_list[-1]

        for part in parts_list:
            del part[-1]
            part[5] = self.get_stock_quantity_part(part)

            for part_info in part:
                if part.index(part_info) == 3 or part.index(part_info) == 4 or part.index(part_info) == 5:
                    part[part.index(part_info)] = float(part_info.replace(',', '.'))

        return parts_list

    def generate_parts_string_from_parts_list(self):
        temp_list = [sub for sub in [elem for elem in self.parts_list]]
        parts_string = ''

        for i in temp_list:
            for x in i:
                parts_string += str(x) + '|?!|'
            parts_string += '/?_!/'

        return parts_string

    def get_num_parts_completed(self):
        num_completed_parts = 0

        for part in self.parts_list:
            try:
                if part[4] >= part[3]:
                    num_completed_parts += 1

            except TypeError:
                print(f'TYPE ERROR OCURRED on {part}')


        return num_completed_parts

    def calculate_completion(self):
        try:
            return round(self.num_completed_parts/self.num_total_parts*100)
        except ZeroDivisionError:
            pass

    def get_stock_quantity_part(self, part_info):
        part_ref = part_info[1]
        part_stock_quantity = '0'

        if part_ref == '1' or part_ref == '130400B00000':
            part_name = part_info[2]
            for part_obj in Part.objects.filter(reference=part_ref):
                if part_name == part_obj.name:
                    part_stock_quantity = part_obj.stock_quantity
                    break
                else:
                    part_stock_quantity = '0'

        else:
            try:
                part_obj_by_ref = Part.objects.get(reference=part_ref)

                part_stock_quantity = part_obj_by_ref.stock_quantity
            except:
                part_stock_quantity = '0'

        return part_stock_quantity


class Shipping(models.Model):
    client = models.TextField(max_length=30)
    doc_type = models.TextField(max_length=8)
    num_doc = models.TextField(max_length=15)
    associated_doc_type = models.TextField(max_length=8)
    order_num_associated_doc = models.TextField(max_length=15)
    vehicle_info = models.TextField(max_length=30)
    total_weight = models.TextField(max_length=15)
    date_inserted = models.DateTimeField(default=timezone.now)
    parts_string = models.TextField()
    notes = models.TextField()

    def __init__(self, *args, delete_order_parts=False, **kwargs):
        super().__init__(*args, **kwargs)
        self.parts_list = self.generate_parts_list_from_parts_string()

        try:
            self.parts_list = self.generate_parts_list_from_parts_string()
            self.num_total_parts = len(self.parts_list)
        except AttributeError:
            print('ATTRIBUTE ERROR OCURRED')

        if delete_order_parts:
            self.delete_shipping_parts_from_order()

    def generate_parts_list_from_parts_string(self):
        parts_list = [elem.split('|?!|') for elem in self.parts_string.split('/?_!/')]
        del parts_list[-1]

        for part in parts_list:
            del part[-1]

            for part_info in part:
                if part.index(part_info) == 3:
                    part[part.index(part_info)] = float(part_info.replace(',', '.'))

        return parts_list

    def generate_parts_string_from_parts_list(self):
        temp_list = [sub for sub in [elem for elem in self.parts_list]]
        parts_string = ''

        for i in temp_list:
            for x in i:
                parts_string += str(x) + '|?!|'
            parts_string += '/?_!/'

        return parts_string

    def delete_shipping_parts_from_order(self):
        order = Order.objects.get(client=self.client, doc_type=self.associated_doc_type, order_num_doc=self.order_num_associated_doc)
        print('INITIAL ORDER PART LIST')
        print(order.parts_list)

        list_parts_to_delete = []

        for order_part in order.parts_list:
            print(f'ORDER PART = {order_part}')
            for shipping_part in self.parts_list:
                print(f'SHIPPING PART = {shipping_part}')
                # print(f'{order_part[0]} == {shipping_part[0]}')
                # print(f'{order_part[1]} == {shipping_part[1]}')
                # print(f'{order_part[2]} == {shipping_part[2]}')
                # print(f'{order_part[4]} == {shipping_part[3]}')
                if order_part[0] == shipping_part[0] and order_part[1] == shipping_part[1] and order_part[2].replace(' ', '') == shipping_part[2].replace(' ', ''):
                    print(f'MATCH OCCURRED - ORDER QTTY: {order_part[3]} - SHIPPING QTTY: {shipping_part[3]}')
                    if float(shipping_part[3]) >= float(order_part[3]):
                        print(f'DELETING ORDER PART {order_part}')
                        list_parts_to_delete.append(order_part)
                    else:
                        print(f'SUBTRACTING VALUE FROM ORDER PART {order_part}')
                        order.parts_list[order.parts_list.index(order_part)][3] = str(float(order_part[3]) - float(shipping_part[3]))
                        order.parts_list[order.parts_list.index(order_part)][4] = str(float(order_part[4]) - float(shipping_part[3]))

        for part in list_parts_to_delete:
            for order_part in order.parts_list:
                if order_part[0] == part[0] and order_part[1] == part[1] and order_part[2].replace(' ', '') == part[2].replace(' ', ''):
                    del order.parts_list[order.parts_list.index(order_part)]

        if len(order.parts_list) == 0:
            order.delete()
        else:
            order.parts_string = order.generate_parts_string_from_parts_list()
            order.save()

        print('UPDATED ORDER PART LIST')
        for order_part in order.parts_list:
            print(order_part)


class Part(models.Model):
    storage = models.TextField(max_length=3)
    reference = models.TextField(max_length=12)
    name = models.TextField(max_length=130)
    stock_quantity = models.TextField(max_length=8)
    stock_unit = models.TextField(max_length=3)
    material = models.TextField(max_length=30)
    weight = models.TextField(max_length=7)
    technical_PDF = models.FileField(default=None, upload_to='fichas_técnicas_artigos')
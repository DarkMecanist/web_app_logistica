
def test_func():
    # import subprocess
    #
    # subprocess.Popen('explorer "C:\GOG Games"')

    from order_organizer.models import Order

    order_1 = Order(client='Movsteel', doc_type='ENCOM', order_num_doc='88888',
                    associated_doc_type='EPROD', order_num_associated_doc='11111',
                    due_date='15/05/2020', parts_string='4||111E00401111||PERFIL METALICO (35x35)x1000 1.2 FERRO GALV. Z275 P/ PLASTICO||10000||10000||10000||UN.||Bobine Galv. 1,5mm||s_ficha||/_/2||111E00401111||ABRÇ. 1||99999||50||250||UN.||Bobine Galv. 1,5mm||C1||/_/6||111E00401111||p1||50||0||100||UN.||Bobine Galv. 1,5mm||s_ficha||/_/')

    order_1.save()

def delete_order():
    print('Deleting order')
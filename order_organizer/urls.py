from django.urls import path
from .views import OrdersPage, ShippingsPage, PartsPage, OrderCreateView, OrderUpdateView, selected_orders, PartCreateView, PartUpdateView, ShippingCreateView, ShippingUpdateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', OrdersPage.as_view(), name='orders_page'),
    path('nova_encomenda/', OrderCreateView.as_view(), name='create_order'),
    path('encomenda/<int:pk>/', OrderUpdateView.as_view(), name='update_order'),
    path('expedicoes/', ShippingsPage.as_view(), name='shippings_page'),
    path('stocks/', PartsPage.as_view(), name='stocks_page'),
    path('selected_orders/', selected_orders, name='selected_orders'),
    path('novo_artigo/', PartCreateView.as_view(), name='create_part_stock'),
    path('artigo/<int:pk>/', PartUpdateView.as_view(), name='update_part_stock'),
    path('nova_expedicao/', ShippingCreateView.as_view(), name='create_shipping'),
    path('expedicao/<int:pk>/', ShippingUpdateView.as_view(), name='update_shipping'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_user_can_register():
    client = APIClient()

    response = client.post(
        "/api/auth/register/",
        {
            "username": "boss",
            "password": "StrongPass123"
        },
        format="json"
    )

    assert response.status_code == 201
